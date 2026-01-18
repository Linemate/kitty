'use client';
import { deleteReview, getMyReviewList, getProgramReview } from 'api';
import Paging from 'components/common/Paging';
import useMobile from 'hooks/useMobile';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/review.scss';
import { popupProps, reviewItemProps } from 'types/types';
import { Button } from '../common/Button';
import { initPopup } from '../Portal/PopupPortal';
import PopupPortal from '../Portal/PopupPortal';
import EditReview from './_Edit';

const ReviewItem = ({ isMy, title, name, score, content, id, createdAt, handleDelete, openModal }: reviewItemProps & { openModal: (id: number, content: string, score: number) => void }) => {
    console.log(id)
    console.log(content)
    console.log(score)
    return (
        <div className="review_item">
            <div className={`star img_${score}`}></div>
            <div className="txt">
                <div className="review_header">
                    <div className='left'>
                        <span className={`${isMy ? 'title' : 'username'}`}>{isMy ? title : name}</span>
                        <span className='date'>{createdAt.split(' ')[0]}</span>
                    </div>
                    {
                        // 내가 쓴 리뷰조회일 때
                        <div className='right only_pc only_my'>
                            <Button classnames={'lightgray btn_edit'} type={'text'} text={`Edit`} onclick={() => openModal?.(id, content, score)} />
                            <Button classnames={'lightgray btn_delete'} type={'text'} text={`Delete`} onclick={() => handleDelete?.(id)} />
                        </div>
                    }
                </div>
                <div className="review_body">
                    <div className="contents">{content}</div>
                </div>
                {
                // 내가 쓴 리뷰조회일 때만 날짜, 편집, 삭제 버튼 표시
                    isMy && openModal && handleDelete &&
                    <div className='review_footer only_my'>
                        <div className="date">{createdAt.split(' ')[0]}</div>
                        <div className="btns">
                            <Button classnames={'lightgray btn_edit'} type={'text'} text={`Edit`} onclick={() => openModal?.(id, content, score)} />
                            <Button classnames={'lightgray btn_delete'} type={'text'} text={`Delete`} onclick={() => handleDelete?.(id)} />
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

const Review = ({ id, isMy, size }: { id?: number, isMy: boolean, size: number }) => {
    const [reviews, setReviews] = useState<reviewItemProps[]>([]);
    const initModal = {
        show:false,
        reviewId:0,
        programId:0,
        content: '',
        score: 0
    }
    const [modal, setModal] = useState<{show: boolean, reviewId: number, programId: number, content: string, score: number}>(initModal);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const isMobile = useMobile();
    const [popup, setPopup] = useState<popupProps>(initPopup);
    const [deleteConfirmPopup, setDeleteConfirmPopup] = useState<popupProps>(initPopup);
    // 리뷰 조회
    const loadProgramReviews = useCallback(async () => {
        try {
            const res = isMy ? await getMyReviewList(page, size) : await getProgramReview(id?.toString() || '0', size, page);
            const data = res.data;
            setReviews(data.list);
            setTotalPages(data.totalPages);
            setPage(data.page);
            console.log(data.list);
        } catch (err) {
            console.log(err);
        }
    }, [isMy, page, size, id]);

    // 리뷰 편집 창 열기
    const openModal = useCallback((reviewId: number, programId: number, content: string, score: number) => {
        console.log(reviewId)
        setModal({show: true, reviewId, programId, content, score});
    }, []);

    // 리뷰 삭제    
    const handleDelete = useCallback(async (id: number) => {
        // 먼저 confirm popup 표시
        setDeleteConfirmPopup({
            show: true,
            children: '작성한 리뷰를 삭제하시겠습니까?',
            type: 'confirm',
            yesFunction: async () => {
                try {
                    const res = await deleteReview(id);
                    if (res && res.code === 200) {
                        setDeleteConfirmPopup(initPopup);
                        setPopup({
                            show: true,
                            children: '리뷰가 삭제되었습니다.',
                            type: 'alert',
                            closePortal: () => {
                                setPopup(initPopup);
                                loadProgramReviews();
                            },
                            noText: '확인',
                        });
                    } else {
                        setDeleteConfirmPopup(initPopup);
                        setPopup({
                            show: true,
                            children: '리뷰 삭제에 실패했습니다.',
                            type: 'alert',
                            closePortal: () => {
                                setPopup(initPopup);
                            },
                            noText: '확인',
                        });
                    }
                } catch (err) {
                    console.log(err);
                    setDeleteConfirmPopup(initPopup);
                    setPopup({
                        show: true,
                        children: '리뷰 삭제에 실패했습니다.',
                        type: 'alert',
                        closePortal: () => {
                            setPopup(initPopup);
                        },
                        noText: '확인',
                    });
                }
            },
            yesText: '확인',
            closePortal: () => {
                setDeleteConfirmPopup(initPopup);
            },
            noText: '취소',
        });
    }, [loadProgramReviews]);

    useEffect(() => {
        loadProgramReviews();
    }, [loadProgramReviews, id]);

    return (
        <>
            <div className={`review_area ${isMobile ? 'mobile' : ''}`}>
                {reviews.length > 0 ? reviews.map((el: reviewItemProps) => (
                    <ReviewItem
                        key={el.id}
                        {...el}
                        isMy={isMy}
                        openModal={(id: number, content: string, score: number) =>
                            openModal(el.id, el.programId, content, score)
                        }
                        handleDelete={handleDelete}
                    />
                )) : <div className="no_review">등록된 후기가 없습니다.</div>}

                <Paging totalPages={totalPages} page={page} changePage={(num: number) => setPage(num)} />
            
                {modal.show && <EditReview reviewId={modal.reviewId} content={modal.content} score={modal.score} closePortal={() => setModal(initModal)} />}
                
            </div>
        </>
    );
};

export default Review;
