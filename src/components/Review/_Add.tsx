'use client';
import { postReview } from 'api';
import ModalPortal from 'components/Portal/ModalPortal';
import React, { useState } from 'react';
import { addReviewProps } from 'types/types';

const AddReview = ({id, closePortal} : {id:number, closePortal:() => void;}) => {
    const [reviewData, setReviewData] = useState<addReviewProps>({content: '', score:0});
    const handleSubmit = async () => {
        try {
            const res = postReview(id.toString(), reviewData);
        } catch(err) {
            console.log(err);
        }
    }
    return (
        <>
            <ModalPortal type='review' title={'리뷰 작성하기'} closePortal={closePortal}>
                <div>

                </div>
            </ModalPortal>
        </>
    );
};

export default AddReview;