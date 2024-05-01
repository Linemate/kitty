'use client'
import Title from 'components/Title/Title';
import React from 'react';
import StyledReview from './StyledReview';
import RoomIcon from '@mui/icons-material/Room';

export type ReviewItemProps = {
    program: string;
    username: string;
    date: string;
    star: number;
    contents: string;
}

const ReviewItem = (props:ReviewItemProps) => {
    return (
        <div>
            <div className='review_title'>
                <div>
                    <RoomIcon />
                    {props.program}
                </div>
                <div>
                    <span className='username'>{props.username}</span>
                    <span className='date'>{props.date}</span>
                </div>
            </div>
            <div className='review_desc'>
                {props.contents}
            </div>
        </div>
    );
};

const Review = () => {
    const fakedata = {
        program: 'Make a traditional food',
        username: 'travelholic21',
        date: '2024. 02. 21',
        star: 4,
        contents: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget duis mi nunc bibendum. Tellus elementum nec lorem eget dictumst. Risus in gravida eu, enim lorem. Sed consequat ut suspendisse eros. Nunc nunc accumsan, viverra enim. Mi.'
    }
    return (
        <StyledReview>
            <Title title={'REVIEW'} />
            <ReviewItem program={fakedata.program} username={fakedata.username} date={fakedata.date} star={fakedata.star} contents={fakedata.contents}  />
        </StyledReview>
    );
};

export default Review;