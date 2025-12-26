'use client';
import { getMyReviewList, getProgramReview } from 'api';
import Paging from 'components/common/Paging';
import useMobile from 'hooks/useMobile';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/review.scss';
import { reviewItemProps, reviewProps } from 'types/types';
import AddReview from './_Add';

const ReviewItem = (props: reviewItemProps) => {
    return (
        <div className="review_item">
            <div className={`star img_${props.score}`}></div>
            <div className="txt">
                <div className="desc_intro">
                    <span className={`${props.isMy ? 'title' : 'username'}`}>{props.isMy ? props.title : props.name}</span>
                    {
                        // 내가 쓴 리뷰조회가 아닐 때
                        !props.isMy &&
                        <span className='date'>{props.createdAt}</span>
                    }
                </div>
                <div className="desc">
                    <div className="contents">{props.content}</div>
                </div>
                {
                // 내가 쓴 리뷰조회일 때만 날짜, 편집, 삭제 버튼 표시
                    props.isMy && props.editReview && props.deleteReview &&
                    <div className='date_btns_area'>
                        <div className="date">{props.createdAt.split(' ')[0]}</div>
                        <div className="btns">
                            <button className="btn_edit" onClick={() => props.editReview?.(props.id)}>편집</button>
                            <button className="btn_delete" onClick={() => props.deleteReview?.(props.id)}>삭제</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

const Review = ({ id, isMy, size }: { id?: string, isMy: boolean, size: number }) => {
    const [reviews, setReviews] = useState<reviewItemProps[]>([]);
    const [modal, setModal] = useState(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const isMobile = useMobile();

    // 리뷰 조회
    const loadProgramReviews = useCallback(async () => {
        try {
            const res = isMy ? await getMyReviewList(page, size) : await getProgramReview(id || '', size, page);
            const data = res.data;
            setReviews(data.list);
            setTotalPages(data.totalPages);
            setPage(data.page);
            console.log(data.list);
        } catch (err) {
            console.log(err);
        }
    }, [isMy, page, size, id]);

    // 리뷰 편집
    const editReview = useCallback(async (id: number) => {
        try {
            const res = await editReview(id);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }, []);

    // 리뷰 삭제    
    const deleteReview = useCallback(async (id: number) => {
        try {
            const res = await deleteReview(id);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        loadProgramReviews();
    }, [loadProgramReviews, id]);

    return (
        <>
            <div className={`review ${isMobile ? 'mobile' : ''}`}>
                {reviews.length > 0 ? reviews.map((el: reviewItemProps) => <ReviewItem key={el.id} isMy={isMy} title={el.title} name={el.name} score={el.score} content={el.content} id={el.id} createdAt={el.createdAt} />) : <div className="no_review">등록된 후기가 없습니다.</div>}

                <Paging totalPages={totalPages} page={page} changePage={(num: number) => setPage(num)} />
            
                {modal && <AddReview id={Number(id)} closePortal={() => setModal(false)} />}
            </div>
        </>
    );
};

export default Review;
