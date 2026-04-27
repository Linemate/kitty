'use client';
import React, { Suspense } from 'react';
import BottomButton from '../_Button';
import 'styles/nicepay.scss';
import useMobile from 'hooks/useMobile';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import { t } from "utils/i18n";

const PaymentsFailContent = () => {
    const isMobile = useMobile();
    return (
        <div className="payment">
            <div className={`wrapper fail ${isMobile ? 'mobile' : ''}`}>
                {/* header */}
                <Header title={''} isDepth={false} isMobileDesc={false} isLogin={false} />
                <div className="img_area">
                    <div className="ico fail"></div>
                </div>
                <div className="title">
                    <h2>{t("결제 실패")}</h2>
                </div>
                <div className="desc_area">
                    <p>{t("결제 실패하였습니다. 다시 시도해주세요.")}</p>
                </div>
                <BottomButton style={'border lightgray'} text={t("홈으로 돌아가기")} href="/" />

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
