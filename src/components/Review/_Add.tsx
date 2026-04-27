'use client';
import { postReview, refreshToken } from 'api';
import ModalPortal from 'components/Portal/ModalPortal';
import React, { useState } from 'react';
import 'styles/review.scss';
import { addReviewProps, popupProps } from 'types/types';
import { Button } from '../common/Button';
import PopupPortal, { initPopup } from '../Portal/PopupPortal';
import { t } from "utils/i18n";

const AddReview = ({id, closePortal} : {id:number, closePortal:() => void;}) => {
    const [reviewData, setReviewData] = useState<addReviewProps>({reviewId: id, title: '', content: '', score:0});
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
            content: value
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

    // 등록하기
    const handleSubmit = async () => {
        if (reviewData.content.trim().length === 0) return;
        try {
            const bodyData = {
                contents: reviewData.content,
                score: reviewData.score
            }
            const res = await postReview(id.toString(), bodyData);
            if (res && res.code === 200) {
                setPopup({
                    show: true,
                    children: t("리뷰가 등록되었습니다."),
                    type: 'alert',
                    closePortal: () => {
                        setPopup(initPopup);
                    },
                    noText: t("확인"), 
                });
            } else {
                setPopup({
                    show: true,
                    children: t("리뷰 등록에 실패했습니다."),
                    type: 'alert',
                    closePortal: () => {
                        setPopup(initPopup);
                    },
                    noText: t("확인"),
                });
            }
        } catch(err) {
            console.log(err);
            setPopup({
                show: true,
                children: t("리뷰 등록에 실패했습니다."),
                type: 'alert',
                closePortal: () => {
                    setPopup(initPopup);
                },
                noText: t("확인"),
            });
        }
    }
    return (
        <>
            <ModalPortal type='review' title={t("리뷰 작성하기")} closePortal={closePortal}>
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
                            placeholder={t("리뷰 내용을 입력해주세요.")}
                            onChange={handleInput}
                            value={reviewData.content}
                            maxLength={MAX_LENGTH}
                        />
                        <div className='review_char_count'>{reviewData.content.length}/{MAX_LENGTH}</div>
                    </div>
                    <div className='review_btn_area'>
                        <Button type="text" classnames={`in_modal ${reviewData.content.trim().length === 0 ? 'disabled' : 'bg_blue'} wide`} onclick={() => handleSubmit()} text={t("등록하기")} />
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
                        noText={popup.noText}
                    >
                        {popup.children}
                    </PopupPortal>
                )
            }
        </>
    );
};

export default AddReview;
