import ModalPortal from 'components/Portal/ModalPortal';
import Modal from 'components/Portal/Modal';
import { Button } from 'components/common/Button';
import React, { use, useCallback, useEffect, useRef, useState } from 'react';
import 'styles/qna.scss';
import PopupPortal, { initPopup } from 'components/Portal/PopupPortal';
import Popup from 'components/Portal/Popup';
import useMobile from 'hooks/useMobile';
import { popupProps, qnaItemProps, qnaProps } from 'types/types';
import { deleteInquiry, getInquiries, postInquiry, refreshToken } from 'api';
import dateTimeOfLanguage from 'utils/dateTimeOfLanguage';
import { useAuthStore, useLanguage } from 'utils/stores';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';

const QnaItem = (props: qnaProps) => {
    const { qna, language, handleDelete } = props;
    const { id, buddy, title, content, answer, isSecret, createdAt } = qna;
    const [seeMore, setSeeMore] = useState<boolean>(true);
    const handleQnaDelete = () => {
        handleDelete(id);
    };
    const handleSeeMore = () => {
        setSeeMore(false);
    };
    return (
        <div className={`qna`}>
            <div className="qna_header">
                <div className="left">
                    {answer && answer.id ? <span className="is_reply no_reply">답변완료</span> : <span className="is_reply reply">미답변</span>}
                    <span className="username">{buddy.name}</span>
                    <span className="date">{dateTimeOfLanguage(createdAt, language)}</span>
                </div>
                {!answer && qna.isOwner && (
                    <div className="right">
                        <Button classnames={'lightgray'} type={'text'} text={`Delete`} onclick={handleQnaDelete} />
                    </div>
                )}
            </div>
            <div className="qna_body">
                <div className={`${isSecret ? 'ico lock' : ''} qna_contents`}>
                    {
                        !content || content === '' ? 'Private post.' : <>
                        
                            {seeMore ? content?.substring(0, 200) : content}
                            {seeMore && content && content.length >= 200 && '...'}
                            {seeMore && content && content.length >= 200 && (
                                <div className="see_more_wrap">
                                    <Button classnames={'lightgray'} type={'text'} text={`See More`} onclick={handleSeeMore} />
                                </div>
                            )}
                        </>
                    }
                </div>
                {
                    // 답변
                    answer && answer.id && (
                        <div className="reply">
                            <div className="reply_contents">{isSecret ? 'Private post.' : answer.contents}</div>
                            <div className="reply_date">{dateTimeOfLanguage(answer.createdAt, language)}</div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

const Qna = ({ id }: { id: string }) => {
    const [modal, setModal] = useState<boolean>(false);
    const [isSecret, setIsSecret] = useState<boolean>(false);
    const [popup, setPopup] = useState<popupProps>(initPopup);
    const [qnaContent, setQnaContent] = useState<string>('');
    const [qnas, setQnas] = useState<qnaItemProps[]>([]);
    const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
    const userInfo = useAuthStore.getState().userInfo;
    const setUserInfo = useAuthStore.getState().setUserInfo;
    const { language } = useLanguage();
    const router = useRouter();
    // page
    const [pageNum, setPageNum] = useState<number>(0);

    const inputRef = useRef<HTMLDivElement>(null);
    const isMobile = useMobile();
    const viewAsk = () => {
        if (userInfo) {
            setModal(true);
        } else {
            alert('로그인 후 이용해주세요.');
            router.push(`/login?redirect=${encodeURIComponent(window.location.origin + '/program/' + id)}`);
        }
    };
    const closePortal = () => {
        setModal(false);
    };

    // qna 조회
    const loadInquiries = async () => {
        try {
            const res = await getInquiries(id, pageNum);
            const list = res.data.list;
            setQnas(list);
        } catch (err) {
            console.log(err);
        }
    };

    // qna 문의하기
    const handleInput = () => {
        if (inputRef.current) {
            // 공백 제외한 글자 수 계산
            const textLength = inputRef.current.innerText.trim().length;
            setIsButtonEnabled(textLength >= 1);
            setQnaContent(inputRef.current.innerText);
        }
    };

    // 비밀글 여부 toggle
    const handlePrivateToggle = () => {
        setIsSecret(!isSecret);
    };

    // 토큰 재발급
    const refreshTokenFn = async () => {
        try {
            const cookies = parseCookies();
            const user = cookies.USERINFO;
            const userInfo = JSON.parse(user);
            if (userInfo) {
                const res = await refreshToken(userInfo.id, userInfo.refreshToken);
                const data = res.data;
                setUserInfo({ ...userInfo, token:data.token, refreshToken:data.refreshToken });
            } else {
                alert('로그인이 필요해요.');
                router.push(`/login?redirect=${encodeURIComponent(window.location.origin + '/program/' + id)}`);
                return;
            }
        } catch(err) {
            console.log(err);
        }
    };

    // submit
    const handleSubmit = async () => {
        try {
            const res = await postInquiry(id, { title: '문의하기', content: qnaContent, isSecret: isSecret });
            if (res.code === 200) {
                setPopup({
                    show: true,
                    children: '문의가 등록되었습니다.',
                    type: 'alert',
                    closePortal: () => {
                        setPopup(initPopup);
                    },
                    noText: '확인',
                });
            } else if (res.code === 401) {
                await refreshTokenFn();
                await handleSubmit();
            } else {
                setPopup({
                    show: true,
                    children: '문의 등록에 실패했습니다.',
                    type: 'alert',
                    closePortal: () => {
                        setPopup(initPopup);
                    },
                    noText: '확인',
                });
            }
            setModal(false);
            setIsButtonEnabled(false);
            loadInquiries();
        } catch (err) {
            console.log(err);
            setPopup({
                show: true,
                children: '문의 등록에 실패했습니다.',
                type: 'alert',
                closePortal: () => {
                    setPopup(initPopup);
                },
                noText: '확인',
            });
        }
    };

    // qna 삭제
    const handleConfirmDelete = async (inquiryId: number) => {
        try {
            const res = await deleteInquiry(Number(id), inquiryId);
            loadInquiries();
        } catch (err) {
            console.log(err);
        }
    };

    // qna 삭제 여부
    const handleDelete = (inquiryId: number) => {
        setPopup({
            show: true,
            children: '작성한 문의를 삭제 하시겠습니까?',
            type: 'confirm',
            yesFunction: () => {
                handleConfirmDelete(inquiryId);
            },
            closePortal: () => {
                setPopup(initPopup);
            },
        });
    };
    useEffect(() => {
        loadInquiries();
    }, [id]);
    return (
        <div className={`qna_area ${isMobile ? 'mobile' : ''}`}>
            <div className="btn_area">
                <Button classnames="fit border lightgray" text={'Ask a question'} type="text" onclick={viewAsk} />
            </div>
            <div>{qnas.length > 0 ? qnas.map((el: qnaItemProps) => <QnaItem qna={el} key={el.id} language={language} handleDelete={() => handleDelete(el.id)} />) : <div className="no_qna">등록된 문의가 없습니다.</div>}</div>
            {modal && (
                <Modal>
                    <ModalPortal type={`qna ${isMobile ? 'mobile' : ''}`} title={'문의 작성하기'} closePortal={closePortal}>
                        <div>
                            <div className="input_area">
                                <div ref={inputRef} className={`input_textbox`} contentEditable onInput={handleInput}></div>
                                {qnaContent.trim().length === 0 && <span className="placeholder">문의 내용을 입력해주세요.</span>}
                            </div>
                            <div className="input_checkbox">
                                <label>
                                    <input type="checkbox" onChange={handlePrivateToggle} />
                                    <span className={`ico checkbox square ${isSecret ? 'checked' : 'default'}`}></span>
                                    <span className="text">Private</span>
                                </label>
                            </div>
                            <div className="infobox">
                                <div className="ico info">You can check the response to your inquiry on the program detail page.</div>
                            </div>
                            <div className="btn_area">
                                <Button type={'text'} onclick={handleSubmit} text={'Submit'} classnames={`${isButtonEnabled ? 'bg_blue' : 'bg_gray'} submit`} />
                            </div>
                        </div>
                    </ModalPortal>
                </Modal>
            )}
            {popup.show && (
                <Popup>
                    <PopupPortal type={popup.type} closePortal={popup.closePortal} noText={popup.noText ? popup.noText : '취소'} yesText={'삭제'} yesFunction={popup.yesFunction}>
                        {popup.children}
                    </PopupPortal>
                </Popup>
            )}
        </div>
    );
};

export default Qna;
