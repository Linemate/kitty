'use client';
import { confirmPayments } from 'api';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import BottomButton from '../_Button';
import 'styles/toss.scss';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import useMobile from 'hooks/useMobile';

const PaymentsSuccessContent = () => {
    const isMobile = useMobile();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
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
                    const res = await confirmPayments(values);
                    setLoading(false);
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
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="payment">
                    <div className={`wrapper success ${isMobile ? 'mobile' : ''}`}>
                        {/* header */}
                        <Header title={'라인메이트 메인'} isDepth={false} isMobileDesc={true} />

                        <div className="img_area">
                            <div className="ico success"></div>
                        </div>
                        <div className="title">
                            <h2>Payment Successful</h2>
                        </div>
                        <div className="desc_area">
                            <p>
                                Your payment has been processed successfully.
                                <br />
                                See you on LineMate, buddy!
                            </p>
                        </div>
                        <BottomButton style={'bg_blue'} />
                        {/* Footer */}
                        <Footer />
                    </div>
                </div>
            )}
        </>
    );
};

// 최상위 컴포넌트: Suspense로 감싸기
export default function PaymentsSuccess() {
    return (
        <Suspense fallback={<div></div>}>
            <PaymentsSuccessContent />
        </Suspense>
    );
}
