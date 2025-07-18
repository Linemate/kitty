'use client';
import React, { Suspense } from 'react';
import BottomButton from '../_Button';
import 'styles/toss.scss';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import useMobile from 'hooks/useMobile';

const PaymentsSuccessContent = () => {
    const isMobile = useMobile();
    return (
        <>
            <div className="payment">
                <div className={`wrapper success ${isMobile ? 'mobile' : ''}`}>
                    {/* header */}
                    <Header title={''} isDepth={false} isMobileDesc={false} />

                    <div className="img_area">
                        <div className="ico success"></div>
                    </div>
                    <div className="title">
                        <h2>결제 완료</h2>
                    </div>
                    <div className="desc_area">
                        <p>
                            결제가 정상적으로 처리되었습니다.
                            <br />
                            라인메이트에서 만나요, buddy!
                        </p>
                    </div>
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
