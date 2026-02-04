'use client';
import { getCancelReasons, getProgramDetails, getReservationInfo, postCancelReason, refreshToken } from 'api';
import Footer from 'components/Footer/Footer';
import Header from 'components/Header/Header';
import ProgramInMypage, { initProgramInMypage } from 'components/Program/ProgramInMypage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'styles/detailsPage.scss';
import { cancelReasonProps, programProps, reservationHistoryProps } from 'types/types';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from 'utils/stores';
import { parseCookies } from 'nookies';
import useMobile from 'hooks/useMobile';
import { Button } from 'components/common/Button';

const Cancel = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [program, setProgram] = useState<reservationHistoryProps>(initProgramInMypage);
    const reservationId = useSearchParams().get('reservationId');
    const {id} = useParams();
    const maxLength = 200;
    const inputRef = useRef<HTMLDivElement>(null);
    const isMobile = useMobile();
    // options
    const [options, setOptions] = useState<cancelReasonProps[]>([]);
    // 선택창 자세히 보기
    const [openSelectOptions, setOpenSelectOptions] = useState<boolean>(false);
    // 선택항목 중 기타 input 열기
    const [openInputOfEtc, setOpenInputOfEtc] = useState<boolean>(false);
    const [selectedReason, setSelectedReason] = useState<cancelReasonProps | null>(null);
    const [selectedReasonText, setSelectedReasonText] = useState<string>('');
    const [reasonDetail, setReasonDetail] = useState<string>('');
    // 상세 사유 활성화
    const [activeDetailReason, setActiveDetailReason] = useState<boolean>(false);
    // check icon
    const [isChecked, setIsChecked] = useState<boolean>(false);
    // 모임 취소하기 버튼 활성화
    const [isBtnActive, setIsBtnActive] = useState<boolean>(false);

    // 로그인 여부
    const userInfo = useAuthStore.getState().userInfo;
    const setUserInfo = useAuthStore.getState().setUserInfo;

    const router = useRouter();

    // 토큰 재발급
    const refreshTokenFn = useCallback(async () => {
        try {
            const cookies = parseCookies();
            const user = cookies.USERINFO;
            const userInfo = JSON.parse(user);
            if (userInfo && userInfo.id) {
                const res = await refreshToken(userInfo.id, userInfo.refreshToken);
                const data = res.data;
                setUserInfo({ ...userInfo, token:data.token, refreshToken:data.refreshToken });
                console.log(res);
            } else {
                alert('로그인이 필요해요.');
                router.push(`/account/login?redirect=${encodeURIComponent(window.location.origin + '/program/' + id)}`);
                return;
            }
        } catch(err) {
            console.log(err);
        }
    }, [id, router, userInfo]);

    // 모임 정보
    // 프로그램 상세
    const loadProgramDetails = useCallback(async (retryCount = 0, maxRetries = 1) => {
        try {
            const res = await getReservationInfo(Number(id), Number(reservationId));
            console.log(res);
            const data = res.data;
            setProgram(data);
            setLoading(false);
        } catch (err) {
            if (
                err &&
                typeof err === 'object' &&
                'status' in err &&
                err.status === 401 &&
                retryCount < maxRetries
              ) {
                console.log('refresh try')
                try {
                    console.log('??');
                  await refreshTokenFn();
                  // 재시도 횟수 증가
                  await loadProgramDetails(retryCount + 1, maxRetries);
                } catch (refreshError) {
                  console.error('토큰 갱신 실패:', refreshError);
                  setLoading(false);
                }
              } else {
                console.error('프로그램 로드 실패:', err);
                setLoading(false);
              }
        }
    }, [id, reservationId, userInfo]);


    // 취소 사유 조회
    const loadCancelReasons = useCallback(async () => {
        try {
            const res = await getCancelReasons(Number(id), Number(reservationId));
            const data = res.data;
            setOptions(data);
            console.log(res)
        } catch (error) {
            console.log(error);
        }
    }, [id, reservationId]);

    // 취소
    const handleCancel = useCallback(async () => {
        try {
            if (selectedReason && isChecked) { 
                if (selectedReason.code === 'OTHER') {
                    if (reasonDetail.trim().length === 0) {
                        alert('상세 사유를 입력해주세요.');
                        return;
                    }
                }               
                const data = {
                    programId: id as string,
                    reservationId: reservationId as string,
                    reason: {
                        reasonCodeId: selectedReason.id,
                        reasonDetail: reasonDetail
                    }
                }
                const res = await postCancelReason(data);
                console.log(res);
                router.push(`/mypage?from=cancel`);
            }
            
        } catch (err) {
            alert('다시 시도해주세요.')
        }
    }, [id, reservationId, selectedReason, reasonDetail, isChecked, router]);

    // 선택창 자세히 보기 on/off
    const handleOpenSelectOptions = () => {
        setOpenSelectOptions(!openSelectOptions);
    };

    // 선택창에서 선택
    const handleSelect = (el: cancelReasonProps) => {
        setSelectedReason(el);
        setSelectedReasonText(el.label);
        setReasonDetail('');
        if (el.code === 'OTHER') {
            setOpenInputOfEtc(true);
        } else {
            setOpenInputOfEtc(false);
        }
    };

    // 기타 - 상세 사유 입력
    const handleInput = () => {
        if (inputRef.current) {
            const text = inputRef.current.innerText;
            const trimmedText = text.substring(0, maxLength);
            if (text.length > maxLength) {
                inputRef.current.innerText = trimmedText;
                setReasonDetail(trimmedText);

                // 커서를 끝으로 이동
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(inputRef.current);
                range.collapse(false);
                if (sel) {
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            } else {
                setReasonDetail(text);
            }
        }
    };

    // 기타 - 상세 사유 helper 비활성화
    const inputDetails = () => {
        setActiveDetailReason(true);
        inputRef.current?.focus();
    };

    // check on/off
    const handleChecked = () => {
        setIsChecked(!isChecked);
    };

    useEffect(() => {
        loadProgramDetails();
    }, [loadProgramDetails]);

    useEffect(() => {
        if (isChecked) {
            if (selectedReason === null) {
                setIsBtnActive(false);
            } else if (selectedReason && selectedReason.id === 0) {
                setIsBtnActive(false);
            } else if (selectedReason && selectedReason.code === 'OTHER' && (!activeDetailReason || reasonDetail.trim().length === 0)) {
                setIsBtnActive(false);
            } else {
                setIsBtnActive(true);
            }
        } else {
            setIsBtnActive(false);
        }
        
    }, [selectedReason, activeDetailReason, isChecked, reasonDetail])

    useEffect(() => {
        loadCancelReasons();
    }, [loadCancelReasons])


    return (
        <div className="reservation_details">
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                {/* Header */}
                <Header title={'모임 대기 취소'} isDepth={true}isLogin={userInfo !== null} />
                {
                    loading ? '' :
                    <div className="contents">
                        <div className="section">
                            <div className="sub_title">모임 정보</div>
                            <div className="desc">
                                <ProgramInMypage reservation={program} type={'simple'} />
                            </div>
                        </div>
                        <div className="section">
                            <div className="sub_title">
                                <div>
                                    취소 사유<span className="text_red2">*</span>
                                </div>
                            </div>
                            <div className="desc">
                                {
                                    <div className="select_wrap" onClick={handleOpenSelectOptions}>
                                        <div className="select_text_wrap">
                                            <div className={`ico arrow_bottom gray ${selectedReason && selectedReason.id === 0 ? 'default' : 'selected'}`}>{selectedReason === null ? '사유를 선택해주세요.' : selectedReasonText}</div>
                                        </div>
                                        {openSelectOptions && (
                                            <div className='select_options_wrap'>
                                                {
                                                    isMobile &&
                                                    <>
                                                        <div className='bg' onClick={handleOpenSelectOptions}></div>
                                                    </>
                                                }
                                                <div className="select_options">
                                                    {
                                                        isMobile &&
                                                        <div className='title'>취소 사유
                                                            <Button text="Close" classnames="close img" type="button" onclick={handleOpenSelectOptions} />
                                                        </div>
                                                    }
                                                    <ul>
                                                        {options.map((el: cancelReasonProps) => (
                                                            <li key={el.id} onClick={() => handleSelect(el)} className={`${selectedReason && selectedReason.id === el.id ? 'selected' : ''}`}>
                                                                <div className="option">{el.label}</div>
                                                                {
                                                                    isMobile &&
                                                                    <span className={`ico radio ${selectedReason && selectedReason.id === el.id ? 'checked' : 'default'}`}></span>
                                                                }
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                }
                            </div>
                        </div>
                        {openInputOfEtc && (
                            <div className="section">
                                <div className="sub_title">
                                    <div>
                                        상세 사유<span className="text_red2">*</span>
                                    </div>
                                    <div>
                                        <span className="letters">
                                            <span className="current">{reasonDetail.length}</span>/{maxLength}
                                        </span>
                                    </div>
                                </div>
                                <div className="input_wrap">
                                    <div className="input" ref={inputRef} onClick={inputDetails} contentEditable onInput={handleInput} suppressContentEditableWarning onCompositionStart={handleInput} onCompositionEnd={handleInput} />
                                    {!activeDetailReason && (
                                        <div className="input_helper" onClick={inputDetails}>
                                            취소하는 상세한 사유를 입력해주세요.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="section price_wrap">
                            <div className="calculate_price">
                                <div className="row">
                                    <div className="cate">결제 금액</div>
                                    <div className="price">{program.currency} {program.price?.toLocaleString()}</div>
                                </div>
                                <div className="row border_bottom">
                                    <div className="cate">취소 수수료</div>
                                    <div className="price">0원</div>
                                </div>
                                <div className="row total">
                                    <div className="cate">환불 금액</div>
                                    <div className="price">{program.currency} {program.price?.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                        <div className="section refund_wrap">
                            <div className="sub_title">환불 규정 안내</div>
                            <div className="dots">
                                <ul>
                                    <li>결제 후 30분 경과 전 : 전액 환불</li>
                                    <li>승인 대기 중인 상태에서 신청 취소한 경우 : 전액 환불</li>
                                    <li>참여 거절되거나 승인 후 내보내진 경우 : 전액 환불 </li>
                                    <li>참여 확정 모임의 진행일 기준 4일 전까지 : 전액 환불</li>
                                    <li>참여 확정 모임의 진행일 기준 3일 전부터 : 환불 불가</li>
                                    <li>모임 진행 당일에 신청한 경우 : 환불 불가 </li>
                                </ul>
                            </div>
                            <div className="ico info">모임 일자가 임박하여 취소하는 경우 취소승인이 불가할 수 있으며, 시작 3일 전에는 환불불가인 점 안내드립니다. 결제 승인 취소는 영업일 기준 3~5일 소요될 수 있어요.</div>
                        </div>
                        <div className="section check_wrap">
                            <div className={`ico checkbox ${isChecked ? 'checked' : 'default'}`} onClick={handleChecked}>
                                환불 규정을 확인했으며, 이에 동의합니다.
                            </div>
                        </div>
                        <div className={`cancel btn text ${isBtnActive ? 'bg_blue' : 'bg_gray'}`} onClick={handleCancel}>모임 취소하기</div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Cancel;
