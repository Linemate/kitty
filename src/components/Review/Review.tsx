'use client';
import { getProgramReview } from 'api';
import Title from 'components/Title/Title';
import { Button } from 'components/common/Button';
import Paging from 'components/common/Paging';
import useMobile from 'hooks/useMobile';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/review.scss';
import { reviewItemProps, reviewProps } from 'types/types';

const ReviewItem = (props: reviewItemProps) => {
    return (
        <div className="review_item">
            <div className={`star img_${props.score}`}></div>
            <div className="txt">
                <div className="desc_intro">
                    <span className="username">{props.name}</span>
                    {/* <span className='date'>{props.date}</span> */}
                </div>
                <div className="desc">
                    <div className="contents">{props.content}</div>
                </div>
            </div>
        </div>
    );
};

const Review = ({ id, size }: { id: string, size: number }) => {
    const [reviews, setReviews] = useState<reviewItemProps[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const isMobile = useMobile();

    const moreList = () => {
        console.log('더보기');
    };

    // 리뷰 조회
    const loadProgramReviews = useCallback(async () => {
        try {
            const res = await getProgramReview(id, size, page);
            const data = res.data;
            setReviews(data.list);
            setTotalPages(data.totalPages);
            setPage(data.page);
            console.log(data.list);
        } catch (err) {
            console.log(err);
        }
    }, [id, page]);

    useEffect(() => {
        loadProgramReviews();
    }, [loadProgramReviews, id]);

    return (
        <>
            <div className={`review ${isMobile ? 'mobile' : ''}`}>
                {reviews.length > 0 ? reviews.map((el: reviewItemProps) => <ReviewItem key={el.id} title={el.title} name={el.name} score={el.score} content={el.content} id={el.id} />) : <div className="no_review">등록된 후기가 없습니다.</div>}

                <Paging totalPages={totalPages} page={page} changePage={(num: number) => setPage(num)} />
            </div>
        </>
    );
};

export default Review;
