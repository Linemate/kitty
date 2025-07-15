'use client';
import React from 'react';
import 'styles/mypage.scss';
import MypageHeader from './_MypageHeader';
import Footer from 'components/Footer/Footer';
import useMobile from 'hooks/useMobile';
import MypageContents from './_MypageContents';
import MypageSideMenu from './_MypageSideMenu';
const MyPage = () => {
    const isMobile = useMobile();
    console.log(isMobile)
    return (
        <div className="mypage">
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                <MypageHeader />
                <div className="contents">
                    <div className="contents_inner">
                        <MypageSideMenu />
                        <MypageContents />
                    </div>
                </div>
            </div>
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default MyPage;
