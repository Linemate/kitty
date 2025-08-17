'use client';
import React, { useEffect, useState } from 'react';
import 'styles/mypage.scss';
import MypageHeader from './_MypageHeader';
import Footer from 'components/Footer/Footer';
import useMobile from 'hooks/useMobile';
import MypageContents from './_MypageContents';
import MypageSideMenu from './_MypageSideMenu';
import { useRouter } from 'next/navigation';
import { useAuthStore } from 'utils/stores';
import { parseCookies } from 'nookies';
import { refreshToken } from 'api';

const MyPage = () => {
  const router = useRouter();
  const userInfo = useAuthStore.getState().userInfo;
  const setUserInfo = useAuthStore.getState().setUserInfo;

  const [hydrated, setHydrated] = useState(false);

  // 훅은 최상단에서 호출
  const isMobile = useMobile(); 

  // hydration 완료 표시
  useEffect(() => {
    setHydrated(true);
  }, []);

  // 토큰 재발급
  const refreshTokenFn = async () => {
    try {
      const cookies = parseCookies();
      const user = cookies.USERINFO;
      const userInfo = JSON.parse(user);
      if (userInfo) {
        const res = await refreshToken(userInfo.id, userInfo.refreshToken);
        const data = res.data;
        setUserInfo({ ...userInfo, token:data.token, refreshToken:data.refreshToken });
      } else {
        alert('로그인이 필요해요.');
        router.push(`/login?redirect=${encodeURIComponent(window.location.origin + '/mypage')}`);
      }
    } catch (err: any) {
      if (err?.status === 401) {
        alert('로그인이 필요해요.');
        router.push(`/login?redirect=${encodeURIComponent(window.location.origin + '/mypage')}`);
      }
    }
  };

  useEffect(() => {
    if (!userInfo) {
        router.push(`/login?redirect=${encodeURIComponent(window.location.origin + '/mypage')}`);
    } else if (userInfo.id == null) {
        refreshTokenFn();
    }
  }, [userInfo, router]);

  if (!hydrated) return <div className="mypage" />;

  return (
    <div className="mypage">
      {userInfo && userInfo.id ? (
        <>
          <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
            <MypageHeader />
            <div className="contents">
              <div className="contents_inner">
                <MypageSideMenu />
                <MypageContents />
              </div>
            </div>
          </div>
          <Footer />
        </>
      ) : null}
    </div>
  );
};

export default MyPage;
