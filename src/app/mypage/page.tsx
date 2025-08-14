'use client';
import React, { useEffect } from 'react';
import 'styles/mypage.scss';
import MypageHeader from './_MypageHeader';
import Footer from 'components/Footer/Footer';
import useMobile from 'hooks/useMobile';
import MypageContents from './_MypageContents';
import MypageSideMenu from './_MypageSideMenu';
import { useRouter } from 'next/navigation';
import { useAuthStore } from 'utils/stores';
const MyPage = () => {
    const isMobile = useMobile();
    const router = useRouter();
    const userInfo = useAuthStore.getState().userInfo;
    useEffect(() => {
        if(!userInfo) {  
            router.push('/login');
        }
    }, [userInfo, router])
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
