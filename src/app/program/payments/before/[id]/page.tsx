'use client';
import { getProgramDetailsWithToken, requestPayments, getCustomForm } from 'api';
import Footer from 'components/Footer/Footer';
import Header from 'components/Header/Header';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/detailsPage.scss';
import { programProps, responsePaymentProps } from 'types/types';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from 'utils/stores';
import useMobile from 'hooks/useMobile';
import WidgetCheckout from 'components/common/WidgetCheckout';
import { Button } from '@/components/common/Button';

const BeforePayment = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [program, setProgram] = useState<programProps | null>(null);
    const [customFormData, setCustomFormData] = useState<any>(null);

    // 결제 
    const [responsePayment, setResponsePayment] = useState<responsePaymentProps | null>(null);
    const [readyToPay, setReadyToPay] = useState<boolean>(false);

    // check icon
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const { id } = useParams();
    const searchParams = useSearchParams();
    const scheduleId = searchParams.get('scheduleId');
    const dateText = searchParams.get('dateText') || '';
    const isMobile = useMobile();

    // 로그인 여부
    const userInfo = useAuthStore((state) => state.userInfo);
    const router = useRouter();

    const loadData = useCallback(async () => {
        try {
            if (!id) return;
            const programIdStr = Array.isArray(id) ? id[0] : id;

            // Fetch program details
            const programRes = await getProgramDetailsWithToken(programIdStr, userInfo?.token);
            setProgram(programRes.data);

            // Fetch custom form data
            const customRes = await getCustomForm(Number(programIdStr));
            setCustomFormData(customRes.data);

            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }, [id, userInfo]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleChecked = () => {
        setIsChecked(!isChecked);
    };

    const handlePayment = async () => {
        if (!isChecked) {
            alert('확인사항에 동의해주세요.');
            return;
        }
        try {
            if (!program || !scheduleId) return;
            const values = {
                programId: program.id,
                scheduleId: Number(scheduleId),
                amount: program.price,
                method: 'CARD',
            };
            const res = await requestPayments(values);
            const data = res.data;
            if (data) {
                setResponsePayment(data);
                setReadyToPay(true);
            }
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || '결제 요청 중 오류가 발생했습니다.');
        }
    };

    const closeWidget = () => {
        setReadyToPay(false);
    };

    const isBtnActive = isChecked;

    return (
        <div className="reservation_details before">
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                <Header title={'결제 전 확인사항'} isDepth={true} isLogin={userInfo !== null} />
                {
                    loading ? <div className="contents"><div className="section">로딩 중...</div></div> :
                        program ?
                            <div className="contents">
                                <div className="section">
                                    <div className="sub_title">모임 정보</div>
                                    <div className="desc">
                                        <ProgramInMypage
                                            reservation={{
                                                ...program,
                                                programId: program.id,
                                                reservationId: 0,
                                                label: '',
                                                reservationStatus: '',
                                                paymentsStatus: '',
                                                startDate: dateText,
                                                createdAt: '',
                                                updatedAt: '',
                                                thumbnail: program.thumbnail,
                                                station: program.station || '',
                                                title: program.title,
                                                price: program.price,
                                                currency: program.currency
                                            } as any}
                                            type={'simple'}
                                        />
                                    </div>
                                </div>

                                {customFormData && (!Array.isArray(customFormData) || customFormData.length > 0) && (
                                    <div className="section">
                                        <div className="sub_title">커스텀 폼 확인사항</div>
                                        <div className="desc">
                                            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                                                {typeof customFormData === 'string' ? customFormData : JSON.stringify(customFormData, null, 2)}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="section price_wrap">
                                    <div className="calculate_price">
                                        <div className="row">
                                            <div className="cate">결제 금액</div>
                                            <div className="price">{program.currency} {program.price?.toLocaleString()}</div>
                                        </div>
                                        <div className="row total border_top" style={{ marginTop: '16px', paddingTop: '16px' }}>
                                            <div className="cate">총 결제 금액</div>
                                            <div className="price">{program.currency} {program.price?.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="section refund_wrap">
                                    <div className="sub_title">환불 규정 안내</div>
                                    <div className="dots">
                                        <ul>
                                            <li>결제 후 30분 경과 전 : 전액 환불</li>
                                            <li>참여 확정 모임의 진행일 기준 4일 전까지 : 전액 환불</li>
                                            <li>참여 확정 모임의 진행일 기준 3일 전부터 : 환불 불가</li>
                                            <li>모임 진행 당일에 신청한 경우 : 환불 불가 </li>
                                        </ul>
                                    </div>
                                    <div className="ico info">결제 승인 취소는 영업일 기준 3~5일 소요될 수 있어요. </div>
                                </div>

                                <div className='bottom'>
                                    <div className="section check_wrap">
                                        위 내용을 확인했으며, 이에 동의합니다.
                                    </div>
                                    <Button type="text" onclick={handlePayment} classnames={`bg_blue wide radius_8  ${isBtnActive ? 'bg_blue' : 'bg_gray'}`} text={'결제하기'} />
                                </div>
                            </div>
                            :
                            <div className="contents"><div className="section">프로그램 정보를 불러오지 못했습니다.</div></div>
                }
            </div>

            {readyToPay && responsePayment && program && scheduleId && (
                <WidgetCheckout
                    responsePayment={responsePayment}
                    program={program}
                    scheduleId={Number(scheduleId)}
                    closeWidget={closeWidget}
                />
            )}
        </div>
    );
};

export default BeforePayment;
