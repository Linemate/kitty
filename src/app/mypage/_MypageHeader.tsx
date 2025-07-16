'use client'
import { Button, TextButtonWithIcon } from 'components/common/Button';
import Header from 'components/Header/Header';
import useMobile from 'hooks/useMobile';
import { useRouter } from 'next/navigation';
import React from 'react';

const MypageHeader = () => {
    const router = useRouter();
    const isMobile = useMobile();
    // 페이지 이동
    const viewPage = (pageName: string) => {
        router.push(`/mypage/${pageName}`);
    };  
    // 프로필 수정
    const handleEditProfile = () => {
        router.push('/mypage/profile');
    }
    return (
        <div>
            {/* Header & Key visual */}
            <Header title={'라인메이트 메인'} />
            <div className="my_info">
                <div className="my_info_inner">
                    <div className="img_area">
                        <div className="none"></div>
                    </div>
                    <div className="desc_area">
                        <div className="user_desc_area">
                            <h3 className="user_name">Happy123</h3>
                            <div className="join_date">2024.01.24 JOIN</div>
                        </div>
                        {
                            isMobile ? <><Button type={'text'} classnames={'wide border lightgray'} text={'프로필 수정'} onclick={handleEditProfile} /></> : ''
                        }
                        <div className="btns_area">
                            <ul>
                                <li>
                                    <TextButtonWithIcon type="text" classnames="top reservations" onclick={() => viewPage('reservations')} text={'My Events'} />
                                </li>
                                <li>
                                    <TextButtonWithIcon type="text" classnames="top qna" onclick={() => viewPage('qna')} text={'Q&A'} />
                                </li>
                                <li>
                                    <TextButtonWithIcon type="text" classnames="top like" onclick={() => viewPage('like')} text={'Like'} />
                                </li>
                                <li>
                                    <TextButtonWithIcon type="text" classnames="top review" onclick={() => viewPage('review')} text={'Review'} />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MypageHeader;