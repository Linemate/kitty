'use client';
import { getCancelReasons, getPaymentHistoryDetails, getProgramDetails, getReservationInfo, postCancelReason, refreshToken } from 'api';
import Footer from 'components/Footer/Footer';
import Header from 'components/Header/Header';
import ProgramInMypage, { initPaymentHistory, initProgramInMypage } from 'components/Program/ProgramInMypage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'styles/detailsPage.scss';
import { cancelReasonProps, paymentHistoryProps, programProps, reservationHistoryProps } from 'types/types';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from 'utils/stores';
import { parseCookies } from 'nookies';
import useMobile from 'hooks/useMobile';

const MyPaymentHistoryDetails = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [details, setDetails] = useState<paymentHistoryProps>(initPaymentHistory);
    const [program, setProgram] = useState<reservationHistoryProps>(initProgramInMypage);
    const reservationId = useSearchParams().get('reservationId');
    const {id} = useParams();
    const isMobile = useMobile();

    // 로그인 여부
    const userInfo = useAuthStore.getState().userInfo;
    const setUserInfo = useAuthStore.getState().setUserInfo;

    const router = useRouter();

    // 토큰 재발급
    const refreshTokenFn = useCallback(async () => {
        try {
            const cookies = parseCookies();
            const user = cookies.USERINFO;
            const userInfo = JSON.parse(user);
            if (userInfo && userInfo.id) {
                const res = await refreshToken(userInfo.id, userInfo.refreshToken);
                const data = res.data;
                setUserInfo({ ...userInfo, token:data.token, refreshToken:data.refreshToken });
                console.log(res);
            } else {
                alert('로그인이 필요해요.');
                router.push(`/account/login?redirect=${encodeURIComponent(window.location.origin + '/program/' + id)}`);
                return;
            }
        } catch(err) {
            console.log(err);
        }
    }, [id, router, userInfo]);

    // 프로그램 상세
    const loadProgramDetails = useCallback(async () => {
        try {
            const res = await getReservationInfo(Number(id), Number(reservationId));
            const data = res.data;
            console.log(data);
            setProgram(data);
        } catch (err) {
            console.log(err);
        }
    }, [id, reservationId]);

    // 결제 내역 상세
    const loadPaymentsHistoryDetails = useCallback(async (retryCount = 0, maxRetries = 1) => {
        try {
            const res = await getPaymentHistoryDetails(Number(id));
            const data = res.data;
            console.log(data);
            await loadProgramDetails();
            setDetails(data);
            setLoading(false);
        } catch (err) {
            if (
                err &&
                typeof err === 'object' &&
                'status' in err &&
                err.status === 401 &&
                retryCount < maxRetries
              ) {
                console.log('refresh try')
                try {
                    console.log('??');
                  await refreshTokenFn();
                  // 재시도 횟수 증가
                  await loadPaymentsHistoryDetails(retryCount + 1, maxRetries);
                } catch (refreshError) {
                  console.error('토큰 갱신 실패:', refreshError);
                  setLoading(false);
                }
              } else {
                console.error('프로그램 로드 실패:', err);
                setLoading(false);
              }
        }
    }, [id, reservationId, userInfo, refreshTokenFn, loadProgramDetails]);

    useEffect(() => {
        loadPaymentsHistoryDetails();
    }, [loadPaymentsHistoryDetails]);

    return (
        <div className="reservation_details">
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                {/* Header */}
                <Header title={details.reservation.label === '취소완료' ? '취소 상세' : '결제 상세'} isDepth={true} isLogin={userInfo !== null} />
                {
                    loading ? '' :
                    <div className="contents">
                        <div className="section">
                            <div className="sub_title">모임 정보</div>
                            <div className="desc">
                                <ProgramInMypage reservation={program} type={'simple'} />
                            </div>
                        </div>
                        <div className="section price_wrap">
                            <div className="calculate_price">
                                <div className="sub_title">결제 내역</div>
                                <div className="row border_top">
                                    <div className="cate">결제 상태</div>
                                    <div className="price">{details.status}</div>
                                </div>
                                <div className="row">
                                    <div className="cate">결제 일시</div>
                                    <div className="price">{details.reservation.createdAt?.toLocaleString()}</div>
                                </div> 
                                <div className="row">
                                    <div className="cate">결제 수단</div>
                                    <div className="price">{details.method}</div>
                                </div>
                                <div className="row border_bottom">
                                    <div className="cate">결제 금액</div>
                                    <div className="price">{details.totalAmount.toLocaleString()}</div>
                                </div>
                                <div className="row total">
                                    <div className="cate">총 결제 금액</div>
                                    <div className={`price ${details.reservation.label === '취소완료' ? '' : 'blue'} `}>{details.totalAmount.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                        {
                            details.reservation.label === '취소완료' ? 
                            <div className="section refund_wrap">
                                <div className="sub_title">환불 규정 안내</div>
                                <div className="dots">
                                    <ul>
                                        <li>결제 후 30분 경과 전 : 전액 환불</li>
                                        <li>승인 대기 중인 상태에서 신청 취소한 경우 : 전액 환불</li>
                                        <li>참여 거절되거나 승인 후 내보내진 경우 : 전액 환불 </li>
                                        <li>참여 확정 모임의 진행일 기준 4일 전까지 : 전액 환불</li>
                                        <li>참여 확정 모임의 진행일 기준 3일 전부터 : 환불 불가</li>
                                        <li>모임 진행 당일에 신청한 경우 : 환불 불가 </li>
                                    </ul>
                                </div>
                                <div className="ico info">모임 일자가 임박하여 취소하는 경우 취소승인이 불가할 수 있으며, 시작 3일 전에는 환불불가인 점 안내드립니다. 결제 승인 취소는 영업일 기준 3~5일 소요될 수 있어요.</div>
                            </div>
                            : ''
                        }
                    </div>
                }
            </div>
        </div>
    );
};

export default MyPaymentHistoryDetails;
