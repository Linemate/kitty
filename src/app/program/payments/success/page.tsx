'use client';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import BottomButton from '../_Button';
import 'styles/nicepay.scss';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import useMobile from 'hooks/useMobile';
import { useAuthStore } from 'utils/stores';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmPayments, getProgramDetailsWithToken } from 'api';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import PaymentLoading from 'components/common/PaymentLoading';

const PaymentsSuccessContent = () => {
    const isMobile = useMobile();
    const userInfo = useAuthStore.getState().userInfo;
    const searchParams = useSearchParams();
    const router = useRouter();

    const [paymentData, setPaymentData] = useState<any>(null); // raw payment object
    const [programData, setProgramData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const hasExecuted = useRef(false);

    useEffect(() => {
        if (hasExecuted.current) return;

        async function fetchPayment() {
            try {
                hasExecuted.current = true;
                const orderId = searchParams.get('orderId');
                const amount = searchParams.get('amount');
                const tid = searchParams.get('tid');

                const programId = searchParams.get('programId');

                if (orderId && tid && amount) {
                    const values = {
                        amount: Number(amount),
                        paymentKey: tid,
                        orderId: orderId,
                    };
                    const res = await confirmPayments(values);

                    if (res?.status === false || res === false) {
                        router.push('/program/payments/fail');
                        return;
                    }

                    setPaymentData(res.data || res);

                    if (programId) {
                        try {
                            const progRes = await getProgramDetailsWithToken(programId, userInfo?.token);
                            setProgramData(progRes.data);
                        } catch (err) {
                            console.error('Failed to load program details', err);
                        }
                    }

                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchPayment();
    }, [searchParams]);

    return (
        <>
            <div className="payment">
                <div className={`wrapper success ${isMobile ? 'mobile' : ''}`}>
                    {/* header */}
                    <Header title={''} isDepth={false} isMobileDesc={false} isLogin={userInfo !== null} />

                    {loading ? (
                        <PaymentLoading />
                    ) : (
                        <>
                            <div className="img_area">
                                <div className="ico success"></div>
                            </div>
                            <div className="title">
                                <h2>신청 완료</h2>
                            </div>

                            {paymentData && (
                                <div className="payment_info_area">
                                    <h3>신청 정보</h3>
                                    <ProgramInMypage reservation={{
                                        programId: programData?.id || Number(searchParams.get('programId') || 0),
                                        title: programData?.title || paymentData.orderName,
                                        thumbnail: programData?.thumbnail,
                                        station: programData?.station,
                                        price: paymentData.totalAmount,
                                        currency: paymentData.currency || programData?.currency,
                                        createdAt: paymentData.approvedAt || paymentData.requestedAt,
                                    } as any} type="simple" />

                                    <div className="details">
                                        <div className='row'>
                                            <span>결제 일시</span>
                                            <span>{(paymentData.approvedAt || paymentData.requestedAt || '').replace('T', ' ').substring(0, 16)}</span>
                                        </div>
                                        <div className='row'>
                                            <span>결제 수단</span>
                                            <span>{paymentData.method === 'CARD' ? '신용카드' : paymentData.method}</span>
                                        </div>
                                        <div className='row'>
                                            <span>결제 금액</span>
                                            <span>{paymentData.currency} {paymentData.totalAmount?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className='btn_area'>
                                <div>
                                    <BottomButton style={'bg_blue'} text="홈으로 돌아가기" href="/" />
                                </div>
                                <div className="last">
                                    <BottomButton style={'lightgray border'} text="마이 페이지로 이동" href="/mypage" />
                                </div>
                            </div>
                        </>
                    )}
                    {/* Footer */}
                    <Footer />
                </div>
            </div>
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
