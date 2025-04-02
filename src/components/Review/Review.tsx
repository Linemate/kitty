'use client'
import Title from 'components/Title/Title';
import { Button } from 'components/common/Button';
import React from 'react';
import 'styles/review.scss'

export type ReviewItemProps = {
    id: number;
    program: string;
    username: string;
    date: string;
    star: number;
    contents: string;
}

export type ReviewProps = {
    reviews: ReviewItemProps[];
}

const ReviewItem = (props:ReviewItemProps) => {
    return (
        <div className='review_item'>
            <div className={`star img_${props.star}`}></div>
            <div className='txt'>
                <div className='desc_intro'>
                    <span className='username'>{props.username}</span>
                    <span className='date'>{props.date}</span>
                </div>
                <div className='desc'>
                    <div className='contents'>
                        {props.contents}
                    </div>
                    <div className='program'>
                        {props.program}
                    </div>
                </div>

            </div>
        </div>
    );
};

const Review = (props:ReviewProps) => {
    const { reviews } = props;

    const moreList = () => {
        console.log('더보기');
    }
    return (
        <>
            <div className='review'>
                {
                    reviews.map((el:ReviewItemProps) => <ReviewItem key={el.id} program={el.program} username={el.username} date={el.date} star={el.star} contents={el.contents} id={el.id}  />)
                }
                <Button classnames={'wide border lightgray'} type={'text'} text={`12개 리뷰 더보기`} onclick={moreList} />
            </div>
        </>
    );
};

export default Review;