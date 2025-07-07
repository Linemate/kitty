'use client';
import React, { Suspense } from 'react';
import BottomButton from '../_Button';
import 'styles/toss.scss';
import useMobile from 'hooks/useMobile';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';

const PaymentsFailContent = () => {
    const isMobile = useMobile();
    return (
        <div className="payment">
            <div className={`wrapper fail ${isMobile ? 'mobile' : ''}`}>
                {/* header */}
                <Header title={'라인메이트 메인'} isDepth={false} isMobileDesc={true} />
                <div className="img_area">
                    <div className="ico fail"></div>
                </div>
                <div className="title">
                    <h2>Payment Failed</h2>
                </div>
                <div className="desc_area">
                    <p>
                        We couldn`t process your payment.
                        <br />
                        Please try again.
                    </p>
                </div>
                <BottomButton style={'border lightgray'} />

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

// 최상위 컴포넌트: Suspense로 감싸기
export default function PaymentsFail() {
    return (
        <Suspense fallback={<div></div>}>
            <PaymentsFailContent />
        </Suspense>
    );
}
