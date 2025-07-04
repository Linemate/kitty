'use client';
import { TossPaymentsWidgets, loadTossPayments } from '@tosspayments/tosspayments-sdk';
import React, { useEffect, useState } from 'react';
import { confirmPaymentProps } from 'types/types';
import 'styles/toss.scss';

function generateRandomString() {
    return window.btoa(Math.random().toString()).slice(0, 20);
}

// ------  결제위젯 초기화 ------
// TODO: clientKey는 개발자센터의 결제위젯 연동 키 > 클라이언트 키로 바꾸세요.
// TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
// @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
const customerKey = generateRandomString();

const WidgetCheckout = (props: confirmPaymentProps) => {
    const { responsePayment, programId, scheduleId } = props;
    const [ready, setReady] = useState<boolean>(false);
    const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);

    useEffect(() => {
        async function fetchPaymentWidgets() {
            try {
                const tossPayments = await loadTossPayments(clientKey);

                // 회원 결제
                // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentswidgets
                const widgets = tossPayments.widgets({
                    customerKey,
                });
                // 비회원 결제
                // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

                setWidgets(widgets);
            } catch (error) {
                console.error('Error fetching payment widget:', error);
            }
        }

        fetchPaymentWidgets();
    }, []);

    useEffect(() => {
        async function renderPaymentWidgets() {
            if (widgets == null) {
                return;
            }

            // ------  주문서의 결제 금액 설정 ------
            // TODO: 위젯의 결제금액을 결제하려는 금액으로 초기화하세요.
            // TODO: renderPaymentMethods, renderAgreement, requestPayment 보다 반드시 선행되어야 합니다.
            // @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
            await widgets.setAmount({
                currency: responsePayment.currency === 'KR' ? 'KRW' : 'KRW',
                value: responsePayment.totalAmount,
            });

            await Promise.all([
                // ------  결제 UI 렌더링 ------
                // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderpaymentmethods
                widgets.renderPaymentMethods({
                    selector: '#payment-method',
                    // 렌더링하고 싶은 결제 UI의 variantKey
                    // 결제 수단 및 스타일이 다른 멀티 UI를 직접 만들고 싶다면 계약이 필요해요.
                    // @docs https://docs.tosspayments.com/guides/v2/payment-widget/admin#새로운-결제-ui-추가하기
                    variantKey: 'DEFAULT',
                }),
                // ------  이용약관 UI 렌더링 ------
                // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderagreement
                widgets.renderAgreement({
                    selector: '#agreement',
                    variantKey: 'AGREEMENT',
                }),
            ]);

            setReady(true);
        }

        renderPaymentWidgets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [widgets]);
    const handleRequestPayment = () => {
        try {
            // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
            // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
            if (widgets) {
                widgets.requestPayment({
                    orderId: responsePayment.orderId, // 고유 주문 번호
                    orderName: '토스 티셔츠 외 2건',
                    successUrl: `${window.location.origin}/program/payments/success?programId=${programId}&scheduleId=${scheduleId}`, // 결제 요청이 성공하면 리다이렉트되는 URL
                    failUrl: window.location.origin + '/program/payments/fail', // 결제 요청이 실패하면 리다이렉트되는 URL
                    customerEmail: 'customer123@gmail.com',
                    customerName: '김토스',
                    // 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되는 값입니다. 필요하다면 주석을 해제해 주세요.
                    // customerMobilePhone: "01012341234",
                });
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="toss_wrapper">
            <div className="bg"></div>
            <div className="toss_box_section">
                {/* 결제 UI */}
                <div id="payment-method"></div>
                {/* 이용약관 UI */}
                <div id="agreement"></div>
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
            </div>
        </div>
    );
};

export default WidgetCheckout;
