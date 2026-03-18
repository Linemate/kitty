'use client';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import BottomButton from '../_Button';
import 'styles/nicepay.scss';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import useMobile from 'hooks/useMobile';
import { useAuthStore } from 'utils/stores';
import { useSearchParams } from 'next/navigation';
import { confirmPayments } from 'api';
import { paymentHistoryProps } from 'types/types';
import ProgramInMypage from 'components/Program/ProgramInMypage';

const PaymentsSuccessContent = () => {
    const isMobile = useMobile();
    const userInfo = useAuthStore.getState().userInfo;
    const searchParams = useSearchParams();

    const [paymentData, setPaymentData] = useState<paymentHistoryProps | null>(null);
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

                if (orderId && tid && amount) {
                    const values = {
                        amount: Number(amount),
                        paymentKey: tid,
                        orderId: orderId,
                    };
                    const res = await confirmPayments(values);
                    setPaymentData(res.data);
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

                    <div className="img_area">
                        <div className="ico success"></div>
                    </div>
                    <div className="title">
                        <h2>신청 완료</h2>
                    </div>
                    <div className="desc_area">
                        <p>
                            결제가 정상적으로 처리되었습니다.
                            <br />
                            라인메이트에서 만나요, buddy!
                        </p>
                    </div>

                    {!loading && paymentData && (
                        <div className="payment_info_area" style={{ padding: '0 20px', marginBottom: '40px', textAlign: 'left' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#111' }}>신청 정보</h3>
                            <ProgramInMypage reservation={paymentData.reservation} type="simple" />

                            <div className="details" style={{ marginTop: '24px', borderTop: '1px solid #eee', paddingTop: '16px', fontSize: '14px', lineHeight: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: '#666' }}>결제 일시</span>
                                    <span>{paymentData.reservation.createdAt ? paymentData.reservation.createdAt.replace('T', ' ').substring(0, 16) : ''}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: '#666' }}>결제 수단</span>
                                    <span>{paymentData.method === 'CARD' ? '신용카드' : paymentData.method}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: '#666' }}>결제 금액</span>
                                    <span style={{ fontWeight: 'bold' }}>{paymentData.reservation.currency} {paymentData.totalAmount?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div>
                        <BottomButton style={'bg_blue'} text="홈으로 돌아가기" href="/" />
                    </div>
                    <div className="last">
                        <BottomButton style={'lightgray border'} text="마이 페이지로 이동" href="/mypage" />
                    </div>
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
