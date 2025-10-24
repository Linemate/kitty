'use client'
import useMobile from 'hooks/useMobile';
import { useCallback, useEffect, useState } from 'react';
import { buddyProfileProps } from 'types/types';
import { useAuthStore } from 'utils/stores';
import { parseCookies } from 'nookies';
import { getBuddyDetails, refreshToken } from 'api';
import { useRouter } from 'next/navigation';
import NoticeMobile from './_MobileVersion';
import NoticePC from './_PCVersion';

export default function Notice() {
    const router = useRouter();
    const isMobile = useMobile();
    const [buddyInfo, setBuddyInfo] = useState<buddyProfileProps | null>(null);
    const userInfo = useAuthStore.getState().userInfo;
    const setUserInfo = useAuthStore.getState().setUserInfo;

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
            alert('로그인이 필요해요.');
            router.push(`/login?redirect=${encodeURIComponent(window.location.origin + '/mypage')}`);
        }
        } catch (err: any) {
        if (err?.status === 401) {
            alert('로그인이 필요해요.');
            router.push(`/login?redirect=${encodeURIComponent(window.location.origin + '/mypage')}`);
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
            router.push(`/login?redirect=${encodeURIComponent(window.location.origin + '/mypage')}`);
        } else if (userInfo.id == null) {
            refreshTokenFn();
        }
    }, [userInfo, router]);
    return (
        <div>
            {
                isMobile ?
                <NoticeMobile buddyInfo={buddyInfo} />
                :
                <NoticePC buddyInfo={buddyInfo} />
            }
        </div>
    );
}