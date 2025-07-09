'use client';
import Footer from 'components/Footer/Footer';
import Header from 'components/Header/Header';
import { TextButtonWithIcon } from 'components/common/Button';
import useMobile from 'hooks/useMobile';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function MypageLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const isMobile = useMobile();
    // 페이지 이동
    const viewPage = (pageName: string) => {
        router.push(`/mypage/${pageName}`);
    };
    return (
        <div className="mypage">
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                {/* Header & Key visual */}
                <Header title={'라인메이트 메인'} isMobileDesc={false} />
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
                <div className="contents">
                    <div className="contents_inner">
                        <div className="side_menu">
                            <h3>MY PAGE</h3>
                            <div className="menus">
                                <dl>
                                    <dt>
                                        <div>MY SETTING</div>
                                    </dt>
                                    <dd>
                                        <div>Profile</div>
                                    </dd>
                                    <dd>
                                        <div>Personal Information</div>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>
                                        <div>PAYMENT</div>
                                    </dt>
                                </dl>
                                <dl>
                                    <dt>
                                        <div>NOTICE</div>
                                    </dt>
                                </dl>
                                <dl>
                                    <dt>
                                        <div>LOGOUT</div>
                                    </dt>
                                </dl>
                            </div>
                        </div>
                        <div className="contents_area">{children}</div>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <Footer />
        </div>
    );
}
