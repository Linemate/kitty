import { Button } from 'components/common/Button';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/qna.scss';
import PopupPortal, { initPopup } from 'components/Portal/PopupPortal';
import useMobile from 'hooks/useMobile';
import { popupProps, qnaItemProps, qnaProps } from 'types/types';
import { deleteInquiry, getInquiries, getMyQnaList } from 'api';
import dateTimeOfLanguage from 'utils/dateTimeOfLanguage';
import { useAuthStore, useLanguage } from 'utils/stores';
import { useRouter } from 'next/navigation';
import Paging from 'components/common/Paging';
import AddQna from './_Add';

const QnaItem = (props: qnaProps & { isMobile: boolean | null }) => {
    const { qna, isMy, isMobile, language, handleDelete } = props;
    const { id, buddy, title, content, answer, isSecret, createdAt } = qna;
    const [seeMore, setSeeMore] = useState<boolean>(true);
    const handleQnaDelete = () => {
        handleDelete(id);
    };
    const handleSeeMore = () => {
        setSeeMore(false);
    };
    return (
        <div className={`qna_item`}>
            <div className="qna_header">
                <div className="left">
                    {answer && answer.id ? <span className="is_reply no_reply">답변완료</span> : <span className="is_reply reply">미답변</span>}
                    <span className="username">{isMy ? title :buddy.name}</span>
                    <span className="date">{isMobile ? createdAt.split(' ')[0] : createdAt}</span>
                </div>
                {!answer && qna.isOwner && (    
                    <div className="right">
                        <Button classnames={'lightgray btn_delete'} type={'text'} text={`Delete`} onclick={handleQnaDelete} />
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
            <div className="qna_footer only_my">
                <div className="date">{dateTimeOfLanguage(createdAt, language)}</div>
                <Button classnames={'lightgray btn_delete'} type={'text'} text={`Delete`} onclick={handleDelete} />
            </div>
        </div>
    );
};

const Qna = ({ id, isMy, size }: { id?: string, isMy: boolean, size: number }) => {
    const [modal, setModal] = useState<boolean>(false);
    const [popup, setPopup] = useState<popupProps>(initPopup);
    const [qnas, setQnas] = useState<qnaItemProps[]>([]);
    const userInfo = useAuthStore.getState().userInfo;
    const { language } = useLanguage();
    const router = useRouter();
    // page
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
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
    const loadInquiries = useCallback(async () => {
        try {
            const res = isMy ? await getMyQnaList(page, size) : await getInquiries(id || '', size, page);
            const data = res.data;
            const list = data.list;
            setQnas(list);
            setTotalPages(data.totalPages);
            setPage(data.page);
        } catch (err) {
            console.log(err);
        }
    }, [page, size, isMy, id]);

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
    }, [loadInquiries]);
    return (
        <div className={`qna_area ${isMobile ? 'mobile' : ''}`}>
            {/* 문의 등록 버튼(내가 쓴 Q&A 조회가 아닐 때만 표시) */}
            {
                !isMy && (
                    <div className="btn_area">
                        <Button classnames="fit border lightgray" text={'Ask a question'} type="text" onclick={viewAsk} />
                    </div>
                )
            }
            {/* 목록 */}
            <div className='qna_list'>{qnas.length > 0 ? qnas.map((el: qnaItemProps) => <QnaItem qna={el} key={el.id} isMy={isMy} isMobile={isMobile} language={language} handleDelete={() => handleDelete(el.id)} />) : <div className="no_qna">등록된 문의가 없습니다.</div>}</div>
            {/* 페이징 */}
            <Paging totalPages={totalPages} page={page} changePage={(num: number) => setPage(num)} />
            {/* 문의 등록하기 */}
            {modal && (
                <AddQna id={id || ''} loadData={loadInquiries} setPopup={setPopup} closePortal={closePortal} />
            )}
            {/* Alert / Confirm 팝업 */}
            {popup.show && (
                <PopupPortal type={popup.type} closePortal={popup.closePortal} noText={popup.noText ? popup.noText : '취소'} yesText={'삭제'} yesFunction={popup.yesFunction}>
                    {popup.children}
                </PopupPortal>
            )}
        </div>
    );
};

export default Qna;
