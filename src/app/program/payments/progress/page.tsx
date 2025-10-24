'use client';
import { confirmPayments } from 'api';
import Footer from 'components/Footer/Footer';
import Header from 'components/Header/Header';
import useMobile from 'hooks/useMobile';
import 'styles/nicepay.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useRef, useState } from 'react';

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
                const programId = searchParams.get('programId');
                const amount = searchParams.get('amount');
                const paymentKey = searchParams.get('paymentKey');
                const scheduleId = searchParams.get('scheduleId');
                if (orderId && programId && amount !== null && paymentKey && scheduleId) {
                    const values = {
                        orderId: orderId,
                        programId: Number(programId),
                        amount: Number(amount),
                        paymentKey: paymentKey,
                        scheduleId: Number(scheduleId),
                    };
                    // confirm api 호출하기
                    const res = await confirmPayments(values);
                    router.push('/program/payments/success');
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

                    <div className="img_area">
                        <div className="ico progress"></div>
                    </div>
                    <div className="title">
                        <h2>결제 진행 중입니다.</h2>
                    </div>
                    <div className="desc_area">
                        <p>잠시만 기다려주세요!</p>
                    </div>
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
