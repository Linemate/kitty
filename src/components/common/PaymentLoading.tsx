import React from 'react';

const PaymentLoading = () => {
    return (
        <>
            <div className="img_area">
                <div className="ico progress"></div>
            </div>
            <div className="title">
                <h2>결제 진행 중입니다.</h2>
            </div>
            <div className="desc_area">
                <p>잠시만 기다려주세요!</p>
            </div>
        </>
    );
};

export default PaymentLoading;
