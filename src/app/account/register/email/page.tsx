'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import 'styles/registerComplete.scss';
import { Button } from 'components/common/Button';
import useMobile from 'hooks/useMobile';
import Header from 'components/Header/Header';
import { postSendAuthCode } from '@/api';

const EmailAuth = () => {
    const router = useRouter();
    const isMobile = useMobile();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || 'Guest';
    const token = searchParams.get('token') || '';

    // 이메일 인증
    const handleResendEmail = async () => {
        try {
            const res = await postSendAuthCode(token);
            console.log(res);

        } catch (err) {
            console.error('Failed to resend email:', err);
        }
    };

    return (
        <div className="register_complete">
            {isMobile && <Header title="Join Us" isLogin={false} />}
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                <div className="contents">
                    <div className="img_area sending">
                        이미지
                    </div>
                    <div className="title">인증 메일이 발송되었습니다.</div>
                    <div className="desc">
                        <span className='email'>{email}</span>으로 인증 메일이 발송되었습니다.<br/>
                        받으신 메일에서 인증 버튼을 누르면 가입이 완료됩니다.
                    </div>
                    
                    <div className="btn_area">
                        <div className="text gray">이메일을 받지 못하셨나요?</div>
                        <Button 
                            type="text" 
                            onclick={handleResendEmail} 
                            classnames="blue" 
                            text="이메일 재발송" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function RegisterEmailAuth() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EmailAuth />
        </Suspense>
    );
}
