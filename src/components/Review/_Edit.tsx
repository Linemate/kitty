'use client';
import { postReview, putReview, refreshToken } from 'api';
import ModalPortal from 'components/Portal/ModalPortal';
import React, { useCallback, useState } from 'react';
import 'styles/review.scss';
import { addReviewProps, popupProps } from 'types/types';
import { Button } from '../common/Button';
import PopupPortal, { initPopup } from '../Portal/PopupPortal';

const EditReview = ({reviewId, content, score, closePortal} : {reviewId:number, content:string, score:number, closePortal:() => void;}) => {
    const [reviewData, setReviewData] = useState<addReviewProps>({contents: content, score: score});
    const [popup, setPopup] = useState<popupProps>(initPopup);
    const MAX_LENGTH = 500;

    // 내용 입력 onChange
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let value = e.target.value;
        if (value.length > MAX_LENGTH) {
            value = value.slice(0, MAX_LENGTH);
        }
        setReviewData({
            ...reviewData,
            contents: value
        })
    }

    // 별점 선택
    const handleScore = (e: React.MouseEvent<HTMLSpanElement>) => {
        const target = e.target as HTMLSpanElement;
        const index = Array.from(target.parentElement!.children).indexOf(target) + 1;
        console.log(index);
        setReviewData({
            ...reviewData,
            score: index
        });
    }

    // 리뷰 편집
    const handleEdit = useCallback(async () => {
        try {
            const res = await putReview(reviewId, {contents: reviewData.contents, score: reviewData.score});
            if (res && res.code === 200) {
                closePortal();
            } else {
                setPopup({
                    show: true,
                    children: '리뷰 수정에 실패했습니다.',
                    type: 'alert',
                    closePortal: () => {
                        setPopup(initPopup);
                    },
                    noText: '확인',
                });
            }
        } catch (err) {
            console.log(err);
            setPopup({
                show: true,
                children: '리뷰 수정에 실패했습니다.',
                type: 'alert',
                closePortal: () => {
                    setPopup(initPopup);
                },
                noText: '확인',
            });
        }
    }, [reviewData.contents, reviewData.score, reviewId, closePortal]);
    return (
        <>
            <ModalPortal type='review' title={'리뷰 편집하기'} closePortal={closePortal}>
                <div className='add_review'>
                    <div className='review_score'>
                        {/* 별점 컴포넌트 추후 구현 예정 */}
                        <div className={`star img_${reviewData.score}`}>
                        </div>
                        <div className='score_area'>
                            <span onClick={handleScore} className={`one_star ${reviewData.score >= 1 ? 'on' : ''}`}></span>
                            <span onClick={handleScore} className={`one_star ${reviewData.score >= 2 ? 'on' : ''}`}></span>
                            <span onClick={handleScore} className={`one_star ${reviewData.score >= 3 ? 'on' : ''}`}></span>
                            <span onClick={handleScore} className={`one_star ${reviewData.score >= 4 ? 'on' : ''}`}></span>
                            <span onClick={handleScore} className={`one_star ${reviewData.score === 5 ? 'on' : ''}`}></span>
                        </div>
                    </div>
                    <div className='review_text_area'>     
                        <textarea
                            placeholder='리뷰 내용을 수정해주세요.'
                            onChange={handleInput}
                            value={reviewData.contents}
                            maxLength={MAX_LENGTH}
                        />
                        <div className='review_char_count'>{reviewData.contents.length}/{MAX_LENGTH}</div>
                    </div>
                    <div className='review_btn_area'>
                        <Button type="text" classnames={`in_modal ${reviewData.contents.trim().length === 0 ? 'disabled' : 'bg_blue'} wide`} onclick={() => handleEdit()} text="등록하기" />
                    </div>
                </div>
            </ModalPortal>

            {
                popup.show && (
                    <PopupPortal
                        show={popup.show}
                        title={popup.title}
                        type={popup.type}
                        closePortal={popup.closePortal}
                    >
                        {popup.children}
                    </PopupPortal>
                )
            }
        </>
    );
};

export default EditReview;
