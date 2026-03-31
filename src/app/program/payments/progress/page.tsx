'use client';
import Footer from 'components/Footer/Footer';
import Header from 'components/Header/Header';
import useMobile from 'hooks/useMobile';
import 'styles/nicepay.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import PaymentLoading from 'components/common/PaymentLoading';

const PaymentsProgressContent = () => {
    const isMobile = useMobile();
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasExecuted = useRef(false);

    useEffect(() => {
        // 이미 실행되었으면 다시 실행하지 않음
        if (hasExecuted.current) return;

        async function successFn() {
            try {
                hasExecuted.current = true; // 실행 시작 시점에 플래그 설정

                const orderId = searchParams.get('orderId');
                const amount = searchParams.get('amount');
                const tid = searchParams.get('tid');

                if (orderId && tid && amount) {
                    router.push(`/program/payments/success?orderId=${orderId}&amount=${amount}&tid=${tid}`);
                } else {
                    router.push('/program/payments/fail');
                }
            } catch (err) {
                console.log(err);
                router.push('/program/payments/fail');
            }
        }
        successFn();
    }, [searchParams, router]);
    return (
        <>
            <div className="payment">
                <div className={`wrapper progress ${isMobile ? 'mobile' : ''}`}>
                    {/* header */}
                    <Header title={''} isDepth={false} isMobileDesc={false} isLogin={true} />

                    <PaymentLoading />
                    {/* Footer */}
                    <Footer />
                </div>
            </div>
        </>
    );
};

// 최상위 컴포넌트: Suspense로 감싸기
export default function PaymentsProgress() {
    return (
        <Suspense fallback={<div></div>}>
            <PaymentsProgressContent />
        </Suspense>
    );
}
