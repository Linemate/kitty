'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import 'styles/registerComplete.scss';
import { Button } from 'components/common/Button';
import useMobile from 'hooks/useMobile';
import Header from 'components/Header/Header';
import { t } from "utils/i18n";
import { useAuthStore } from 'utils/stores';

const CompleteContent = () => {
    const router = useRouter();
    const isMobile = useMobile();
    const searchParams = useSearchParams();
    const name = searchParams.get('name') || 'Guest';
    const redirectUrl = searchParams.get('redirect') || '';
    const isLogin = useAuthStore((state) => !!state.userInfo?.token);

    const handleLogin = () => {
        if (isLogin) {
            const target = redirectUrl ? decodeURIComponent(redirectUrl) : '/';
            router.push(target);
        } else {
            router.push('/account/login');
        }
    };

    return (
        <div className="register_complete">
            {isMobile && <Header title="Join Us" isLogin={false} />}
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                <div className="contents">
                    <div className="img_area">
                        {t("이미지")}</div>
                    <div className="title">{t("가입이 완료되었습니다!")}</div>
                    <div className="desc">
                        <span className='name'>{name}</span>{t("님,")}<br />
                        {t("LINEMATE 가입을 환영합니다.")}</div>

                    <div className="btn_area">
                        <Button
                            type="text"
                            onclick={handleLogin}
                            classnames="bg_blue wide radius_8"
                            text={isLogin ? t("홈으로") : t("로그인")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function RegisterComplete() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CompleteContent />
        </Suspense>
    );
}
