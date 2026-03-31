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
            console.log('=== 나이스페이먼츠 결제 요청 ===');
            console.log('orderId:', responsePayment.orderId);
            console.log('amount:', responsePayment.amount);
            (window as any).AUTHNICE.requestPay({
                clientId: 'S2_003b532bf4e741bc85fdb973e8939527', // 나이스페이 클라이언트 키
                method: 'card', // 결제 수단 무조건 카드로!!
                orderId: responsePayment.orderId,
                amount: responsePayment.amount,
                goodsName: program.title,
                returnUrl: `${window.location.origin}/api/nice/redirect?programId=${program.id}`,
                cancelUrl: `${window.location.origin}/program/payments/fail?program=${program.id}`,
                buyerName: userInfo?.name || '고객',
                buyerEmail: userInfo?.email || '',
                mallReserved: `test=true&timestamp=${Date.now()}`,
                fnError: (result: any) => {
                    console.error('나이스페이 에러:', result);
                    alert(`결제 실패: ${result.resultMsg}`);
                },
            },
                function (response: any) {
                    // 결제 인증 성공 콜백
                    if (response.resultCode === '0000') {
                        console.log(response.tid);


                    } else {
                        console.log('결제 인증 실패: ' + response.resultMsg, true, response);
                    }
                });
        }
    }, [ready, responsePayment.orderId, responsePayment.amount, program.title, scheduleId, userInfo]);

    return (
        <>
        </>
    );
};

export default WidgetCheckout;
