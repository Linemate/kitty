'use client';
import { getCancelReasons } from 'api';
import Footer from 'components/Footer/Footer';
import Header from 'components/Header/Header';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'styles/cancelPage.scss';
import { cancelReasonProps } from 'types/types';
import { useParams, useSearchParams } from 'next/navigation';

const Cancel = () => {
    const reservationId = useSearchParams().get('reservationId');
    const {id} = useParams();
    const maxLength = 200;
    const inputRef = useRef<HTMLDivElement>(null);
    // options
    const [options, setOptions] = useState<cancelReasonProps[]>([]);
    // 선택창 자세히 보기
    const [openSelectOptions, setOpenSelectOptions] = useState<boolean>(false);
    // 선택항목 중 기타 input 열기
    const [openInputOfEtc, setOpenInputOfEtc] = useState<boolean>(false);
    const [selectedReasonId, setSelectedReasonId] = useState<number>(0);
    const [selectedReasonText, setSelectedReasonText] = useState<string>('');
    const [detailReason, setDetailReason] = useState<string>('');
    // 상세 사유 활성화
    const [activeDetailReason, setActiveDetailReason] = useState<boolean>(false);
    // 한글 조합 중
    const [isComposing, setIsComposing] = useState(false);
    // check icon
    const [isChecked, setIsChecked] = useState<boolean>(false);
    // 모임 취소하기 버튼 활성화
    const [isBtnActive, setIsBtnActive] = useState<boolean>(false);

    // 취소 사유 조회
    const loadCancelReasons = useCallback(async () => {
        try {
            const res = await getCancelReasons(Number(id), Number(reservationId));
            setOptions(res);
        } catch (error) {
            console.log(error);
        }
    }, [id, reservationId]);

    // 선택창 자세히 보기 on/off
    const handleOpenSelectOptions = () => {
        setOpenSelectOptions(!openSelectOptions);
    };

    // 선택창에서 선택
    const handleSelect = (id: number, text: string) => {
        setSelectedReasonId(id);
        setSelectedReasonText(text);
        setDetailReason('');
        setOpenInputOfEtc(false);
    };

    // 기타 선택
    const selectEtc = () => {
        handleOpenSelectOptions();
        setOpenInputOfEtc(true);
    };

    // 기타 - 상세 사유 입력
    const handleInput = () => {
        if (inputRef.current) {
            const text = inputRef.current.innerText;
            const trimmedText = text.substring(0, maxLength);
            if (text.length > maxLength) {
                inputRef.current.innerText = trimmedText;
                setDetailReason(trimmedText);

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
                setDetailReason(text);
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
        if (selectedReasonId === 0) {
            setIsBtnActive(false);
        } else if (selectedReasonId === 1 && !activeDetailReason) {
            setIsBtnActive(false);
        } else {
            setIsBtnActive(true);
        }
    }, [selectedReasonId, activeDetailReason])

    useEffect(() => {
        loadCancelReasons();
    }, [loadCancelReasons])

    return (
        <div className="cancel">
            <div className="wrapper">
                {/* Header */}
                <Header title={'모임 대기 취소'} isDepth={true} />
                <div className="contents">
                    <div className="section">
                        <div className="sub_title">모임 정보</div>
                        <div className="desc">
                            <ProgramInMypage id={4} name={'MAKE A TRADITIONAL FOOD WITH KOREAN FRIENDS'} status={'attended'} applyDate={'02.12(Mon)'} date={'2024.02.12(Mon) 1:00 PM '} location={'Gangnam Station'} type={'simple'} />
                        </div>
                    </div>
                    <div className="section">
                        <div className="sub_title">
                            <div>
                                취소 사유<span className="text_red2">*</span>
                            </div>
                        </div>
                        <div className="desc">
                            <div className="select_wrap" onClick={handleOpenSelectOptions}>
                                <div className="select_text_wrap">
                                    <div className={`ico arrow_bottom gray ${selectedReasonId === 0 ? 'default' : 'selected'}`}>{selectedReasonId === 0 ? '사유를 선택해주세요.' : selectedReasonText}</div>
                                </div>
                                {openSelectOptions && (
                                    <div className="select_options">
                                        <ul>
                                            {options.map((el: any) => (
                                                <li key={el.id} onClick={() => handleSelect(el.id, el.text)}>
                                                    <div className="option">{el.text}</div>
                                                </li>
                                            ))}
                                            <li onClick={selectEtc}>
                                                <div className="option">기타</div>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
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
                                        <span className="current">{detailReason.length}</span>/{maxLength}
                                    </span>
                                </div>
                            </div>
                            <div className="input_wrap">
                                <div className="input" ref={inputRef} contentEditable onInput={handleInput} suppressContentEditableWarning onCompositionStart={handleInput} onCompositionEnd={handleInput} />
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
                                <div className="price">45,000원</div>
                            </div>
                            <div className="row border_bottom">
                                <div className="cate">취소 수수료</div>
                                <div className="price">0원</div>
                            </div>
                            <div className="row total">
                                <div className="cate">환불 금액</div>
                                <div className="price">45,000원</div>
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
                    <div className={`cancel btn text ${isBtnActive ? 'bg_blue' : 'bg_gray'}`}>모임 취소하기</div>
                </div>
            </div>
        </div>
    );
};

export default Cancel;
