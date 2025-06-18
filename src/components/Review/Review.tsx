'use client'
import { getProgramReview } from 'api';
import Title from 'components/Title/Title';
import { Button } from 'components/common/Button';
import useMobile from 'hooks/useMobile';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/review.scss'
import { reviewItemProps, reviewProps } from 'types/types';

const ReviewItem = (props:reviewItemProps) => {
    return (
        <div className='review_item'>
            <div className={`star img_${props.score}`}></div>
            <div className='txt'>
                <div className='desc_intro'>
                    <span className='username'>{props.name}</span>
                    {/* <span className='date'>{props.date}</span> */}
                </div>
                <div className='desc'>
                    <div className='contents'>
                        {props.content}
                    </div>
                </div>

            </div>
        </div>
    );
};

const Review = ({ id } : {id : string}) => {
    const [reviews, setReviews] = useState<reviewItemProps[]>([]);
    const [pageNum, setPageNum] = useState<number>(1);
    const isMobile = useMobile();

    const moreList = () => {
        console.log('더보기');
    }

    // 리뷰 조회
    const loadProgramReviews = useCallback(async () => {
        try {
            const res = await getProgramReview(id, pageNum);
            const data = res.data;
            setReviews(data.list);
        } catch(err) {console.log(err);}
    }, [id]);

    useEffect(() => {
        loadProgramReviews();
    }, [loadProgramReviews, id]);

    return (
        <>
            <div className={`review ${isMobile ? 'mobile' : ''}`}>
                {
                    reviews.map((el:reviewItemProps) => <ReviewItem key={el.id} title={el.title} name={el.name} score={el.score} content={el.content} id={el.id}  />)
                }
                <Button classnames={'wide border lightgray'} type={'text'} text={`12개 리뷰 더보기`} onclick={moreList} />
            </div>
        </>
    );
};

export default Review;