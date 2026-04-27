'use client';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/mypage.scss';
import MypageHeader from './_MypageHeader';
import Footer from 'components/Footer/Footer';
import useMobile from 'hooks/useMobile';
import MypageContents from './_MypageContents';
import MypageSideMenu from './_MypageSideMenu';
import { useRouter } from 'next/navigation';
import { useAuthStore } from 'utils/stores';
import { parseCookies } from 'nookies';
import { getBuddyDetails, refreshToken } from 'api';
import { buddyProfileProps } from 'types/types';
import Toast from 'components/common/Toast';
import { t } from "utils/i18n";

const MyPage = () => {
  const router = useRouter();
  const [buddyInfo, setBuddyInfo] = useState<buddyProfileProps | null>(null);
  const userInfo = useAuthStore.getState().userInfo;
  const setUserInfo = useAuthStore.getState().setUserInfo;
  const [from, setFrom] = useState<string | null>(null);
  const [isToast, setIsToast] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState(false);

  // 훅은 최상단에서 호출
  const isMobile = useMobile(); 

  // hydration 완료 표시
  useEffect(() => {
    setHydrated(true);
  }, []);

  // 토큰 재발급
  const refreshTokenFn = useCallback(async () => {
    try {
      const cookies = parseCookies();
      const user = cookies.USERINFO;
      const userInfo = JSON.parse(user);
      if (userInfo) {
        const res = await refreshToken(userInfo.id, userInfo.refreshToken);
        const data = res.data;
        setUserInfo({ ...userInfo, token:data.token, refreshToken:data.refreshToken });
      } else {
        alert(t("로그인이 필요해요."));
        router.push(`/account/login?redirect=${encodeURIComponent(window.location.origin + '/mypage')}`);
      }
    } catch (err: any) {
      if (err?.status === 401) {
        alert(t("로그인이 필요해요."));
        router.push(`/account/login?redirect=${encodeURIComponent(window.location.origin + '/mypage')}`);
      }
    }
  }, [userInfo, router]);

  useEffect(() => {
      const loadBuddyInfo = async () => {
          try {
              const res = await getBuddyDetails(userInfo?.id || 0);
              const data = res.data;
              setBuddyInfo(data);
          } catch (err) {
              refreshTokenFn();
          }
      }
      loadBuddyInfo();
  }, [userInfo, refreshTokenFn])

  useEffect(() => {
    if (!userInfo) {
        router.push(`/account/login?redirect=${encodeURIComponent(window.location.origin + '/mypage')}`);
    } else if (userInfo.id == null) {
        refreshTokenFn();
    }
  }, [userInfo, router]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    if (from) {
      setFrom(from);
      setIsToast(true);
      window.history.replaceState('', '', `/mypage`);
      setTimeout(() => {
        setFrom(null);
        setIsToast(false);
      }, 3000);
    }
  }, []);

  if (!hydrated) return <div className="mypage" />;

  return (
    <div className="mypage">
      {userInfo && userInfo.id ? (
        <>
          <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
            <MypageHeader buddyInfo={buddyInfo} />
            <div className="contents">
              <div className="contents_inner">
                <MypageSideMenu />
                <MypageContents />
              </div>
            </div>
          </div>
          <Footer />
          {
            from === 'cancel' && isToast && <Toast message={t("모임 신청이 취소되었습니다.")} type="success" duration={3000} />
          }
        </>
      ) : null}
    </div>
  );
};

export default MyPage;
