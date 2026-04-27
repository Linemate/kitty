'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { buddyProfileProps, paymentHistoryProps } from 'types/types';
import { useRouter } from 'next/navigation';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import { getPaymentHistory } from 'api';
import MypageHeader from '../_MypageHeader';
import MypageSideMenu from '../_MypageSideMenu';
import Footer from 'components/Footer/Footer';
import { Button } from 'components/common/Button';
import MyHistoryTab from './_Tab';
import Title from 'components/Title/Title';
import Paging from 'components/common/Paging';
import { t } from "utils/i18n";

const MyPaymentHistoryPC = ({buddyInfo}: {buddyInfo: buddyProfileProps | null}) => {
    const [paymentHistory, setPaymentHistory] = useState<paymentHistoryProps[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [tab, setTab] = useState('');
    const router = useRouter();
 
    const changePage = (num:number) => {
        setPage(num);
    }

    // 결제 상세 페이지로 이동
    const viewDetails = (id:number, reservationId:number) => {
        router.push(`/mypage/payment/details/${id}?reservationId=${reservationId}`);
    }

    // 결제 내역
    const loadPaymentHistory = useCallback(async () => {
        try {
            const res = await getPaymentHistory(page, 10, tab);
            const data = res.data;
            const list = data.list;
            setPaymentHistory(list);
            setTotalPages(data.totalPages);
        } catch (err) {
            if (err && typeof err === 'object' && 'status' in err && 
                err.status === 401) {
                console.log(err)
                alert(t("로그인이 필요해요."));
                router.push(`/account/login?redirect=${encodeURIComponent(window.location.origin + '/mypage/payment')}`);
            }
            return;
        }
    }, [page, tab, router])
    
    // 탭 변경
    const changeTab = (tabText:string) => {
        setTab(tabText.toUpperCase());
    }
    
    useEffect(() => {
        setPage(0);
    }, [tab])

    useEffect(() => {
        loadPaymentHistory();
    }, [loadPaymentHistory, tab])

    useEffect(() => {
        console.log(buddyInfo)
    }, [buddyInfo])

    return (
        <div className='mypage all'>
            <div className={`wrapper pc`}>
                {/* Header */}
                <MypageHeader buddyInfo={buddyInfo} />
                <div className='contents'>
                    <div className='contents_inner'>
                        <MypageSideMenu />
                        <div className='contents_area'>
                            <div className='intro'>
                                <div>
                                    <Title title={t("결제 내역")} />
                                </div>
                            </div>
                            <MyHistoryTab tab={tab} changeTab={changeTab} />
                            <div className='programs'>
                                {
                                    paymentHistory.length === 0 ? 
                                    <>
                                        <div className="nothing">
                                            <div className="bg">
                                                <div className="notice">
                                                    <p className="first_line">No meetings applied yet.</p>
                                                    <p>Explore Line Mate&apos;s meetings now!</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                    {
                                        paymentHistory.map((el:paymentHistoryProps, index:number) => (
                                            <ProgramInMypage key={index} label={el.label} reservation={el.reservation} type='payment'>
                                                {
                                                    el.reservation.label === "취소완료" ?
                                                    <Button type="text" classnames={`border lightgray cancel`} onclick={() => viewDetails(el.id, el.reservation.reservationId!)} text={t("취소 상세")} />
                                                    :
                                                    <Button type="text" classnames={`border lightgray cancel`} onclick={() =>  viewDetails(el.id, el.reservation.reservationId!)} text={t("결제 상세")} />
                                                }
                                            </ProgramInMypage>
                                        ))
                                        }
                                    </>
                                }
                            </div>
                            {
                                paymentHistory.length > 0 &&
                                <Paging totalPages={totalPages} page={page} changePage={changePage} />
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default MyPaymentHistoryPC;