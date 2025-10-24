'use client'
import { getPaymentHistory } from 'api';
import Header from 'components/Header/Header';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import { Button } from 'components/common/Button';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/mypage.scss';
import { buddyProfileProps, paymentHistoryProps, reservationHistoryProps } from 'types/types';
import { useRouter } from 'next/navigation';
import { useAuthStore } from 'utils/stores';
import MyHistoryTab from './_Tab';
import Paging from 'components/common/Paging';

const MyPaymentHistoryMobile = ({buddyInfo}: {buddyInfo: buddyProfileProps | null}) => {
    const [paymentHistory, setPaymentHistory] = useState<paymentHistoryProps[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [tab, setTab] = useState('');
    const router = useRouter();

    // 로그인 여부
    const userInfo = useAuthStore.getState().userInfo;

    // 결제 내역
    const loadPaymentHistory = useCallback(async () => {
        try {
            const res = await getPaymentHistory(page, 10, tab);
            const data = res.data;
            const list = data.list;
            setPaymentHistory(list);
            setTotalPages(data.totalPages);
            console.log(list)
        } catch (err) {
            if (err && typeof err === 'object' && 'status' in err && 
                err.status === 401) {
                console.log(err)
                alert('로그인이 필요해요.');
                router.push(`/login?redirect=${encodeURIComponent(window.location.origin + '/mypage/payment')}`);
            }
            return;
        }
    }, [page, router, tab])  
    
    // 탭 변경
    const changeTab = (tabText:string) => {
        setTab(tabText.toUpperCase());
    }

    // 결제 상세 페이지로 이동
    const viewDetails = (id:number, reservationId:number) => {
        router.push(`/mypage/payment/details/${id}?reservationId=${reservationId}`);
    }

    const changePage = (num:number) => {
        setPage(num);
    }
    
    useEffect(() => {
        setPage(0);
    }, [tab])

    useEffect(() => {
        loadPaymentHistory();
    }, [loadPaymentHistory, tab, page])


    return (
        <div className='mypage all payment_history'>
            <div className={`wrapper mobile`}>
                <div className='intro'></div>
                {/* Header */}
                <Header title={'결제 내역'} isDepth={true} isLogin={userInfo !== null} />
                <div className='contents'>
                    <div className='contents_inner'>
                        <MyHistoryTab tab={tab} changeTab={changeTab} />
                        <div className='contents_area'>
                            <div className='programs'>
                                {
                                    paymentHistory.length === 0 ? 
                                    <>
                                        {/* 결제 내역이 비었을 때 */}
                                        <div className="nothing">
                                            <div className='ico payment'><p>결제 내역이 없습니다.</p></div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        {
                                            paymentHistory.map((el:paymentHistoryProps, index:number) => 
                                                <ProgramInMypage key={index} label={el.label} reservation={el.reservation} type='payment'>
                                                    {
                                                        el.reservation.label === '취소완료' ?
                                                        <Button type="text" classnames={`border lightgray cancel wide`} onclick={() => viewDetails(el.id, el.reservation.reservationId!)} text="취소 상세" />
                                                        :
                                                        <Button type="text" classnames={`border lightgray cancel wide`} onclick={() =>  viewDetails(el.id, el.reservation.reservationId!)} text="결제 상세" />
                                                    }
                                                </ProgramInMypage>
                                            )
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
        </div>
    );
};

export default MyPaymentHistoryMobile;