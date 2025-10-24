'use client';
import React, { useEffect, useState } from 'react';
import { confirmPaymentProps } from 'types/types';
import 'styles/nicepay.scss';
import useMobile from 'hooks/useMobile';
import useBodyLock from 'hooks/useBodyLock';
import { Button } from './Button';
import { useAuthStore } from 'utils/stores';
import { getNicePayCallback } from 'api';


const WidgetCheckout = (props: confirmPaymentProps) => {
    const { responsePayment, program, scheduleId, closeWidget } = props;
    const [ready, setReady] = useState<boolean>(false);
    const isMobile = useMobile();
    const userInfo = useAuthStore.getState().userInfo;

    useBodyLock(true);

    
    const handleRequestPayment = () => {
        try {
            if (typeof window !== 'undefined' && typeof (window as any).goPay === 'function') {
                (window as any).goPay({
                    orderId: responsePayment.orderId,
                    amount: responsePayment.amount,
                    method: 'card',
                    successUrl: `${window.location.origin}/program/payments/progress?programId=${program.id}&scheduleId=${scheduleId}`,
                    failUrl: window.location.origin + '/program/payments/fail',
                    customerEmail: userInfo?.email || '',
                    customerName: userInfo?.name || '',
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const nicePayCallback = async (values: any) => {
        try {
            const res = await getNicePayCallback(values);
            console.log(res);
            // return `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/payments/nice/callback`;
        } catch (err) {
            console.log(err);
        }
    }

    // 나이스페이 JS SDK 로드
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://pay.nicepay.co.kr/v1/js/';
        script.async = true;
        script.onload = () => {
            console.log('나이스페이 SDK 로드 완료:', (window as any).AUTHNICE);
            setReady(true); // SDK 로드 완료 시 버튼 활성화
        };
        script.onerror = () => {
            console.error('나이스페이 SDK 로드 실패');
            setReady(false);
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    // 컴포넌트 마운트 시 결제창 호출
    useEffect(() => {
        if (ready && typeof window !== 'undefined' && typeof (window as any).AUTHNICE.requestPay === 'function') {
            (window as any).AUTHNICE.requestPay({
                clientId: 'S2_003b532bf4e741bc85fdb973e8939527', // 나이스페이 클라이언트 키
                method: 'card', // 결제 수단 무조건 카드로!!
                orderId: responsePayment.orderId,
                amount: responsePayment.amount,
                goodsName: program.title,
                returnUrl: `${window.location.origin}/program/payments/progress?programId=${program.id}&scheduleId=${scheduleId}`, // 백엔드 API
                cancelUrl: `${window.location.origin}/program/payments/fail`,
                buyerName: userInfo?.name || '고객',
                buyerEmail: userInfo?.email || '',
                mallReserved: `test=true&timestamp=${Date.now()}`,
                fnError: (result: any) => {
                    console.error('나이스페이 에러:', result);
                    alert(`결제 실패: ${result.resultMsg}`);
                },
            });
        }
    }, [ready, responsePayment.orderId, responsePayment.amount, program.title, scheduleId, userInfo]);

    return (
        <div className={`reservation_widget_wrapper ${isMobile ? 'mobile' : ''}`}>
            <div className="bg"></div>
            <div className="reservation_widget_section">
                {/* 결제 UI */}
                <div id="payment-method"></div>
                {/* 결제하기 버튼 */}
                <button
                    className="btn_payments"
                    style={{ marginTop: '30px' }}
                    disabled={!ready}
                    // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
                    // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrequestpayment
                    onClick={handleRequestPayment}>
                    결제하기
                </button>
                <div className="reservation_widget_close">
                    <Button text="Close" classnames="close img" type="button" onclick={closeWidget} />
                </div>
            </div>
        </div>
    );
};

export default WidgetCheckout;
