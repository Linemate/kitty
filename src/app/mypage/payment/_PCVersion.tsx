'use client'
import Header from 'components/Header/Header';
import React, { useCallback, useEffect, useState } from 'react';
import { buddyProfileProps, paymentHistoryProps } from 'types/types';
import { useRouter } from 'next/navigation';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import { getPaymentHistory, getReservationHistory } from 'api';
import MypageHeader from '../_MypageHeader';
import MypageSideMenu from '../_MypageSideMenu';
import Footer from 'components/Footer/Footer';
import { Button } from 'components/common/Button';
import MyHistoryTab from './_Tab';

const MyPaymentHistoryPC = ({buddyInfo}: {buddyInfo: buddyProfileProps | null}) => {
    const [paymentHistory, setPaymentHistory] = useState<paymentHistoryProps[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [tab, setTab] = useState('');
    const router = useRouter();
 
    // paging
    const viewPaging = (num:number) => {
        setPage(num);
    }

    // 페이징 왼쪽 방향 버튼
    const viewPrev = () => {
        if(page > 0) {
            setPage(page - 1);
        }
    }

    // 페이징 오른쪽 방향 버튼
    const viewNext = () => {
        if(page < totalPages - 1) {
            setPage(page + 1);
        }
    }

    // 결제 상세 페이지로 이동
    const viewDetails = (id:number) => {
        router.push(`/mypage/payment/details/${id}`);
    }

    // 결제 내역
    const loadReservationHistory = useCallback(async () => {
        try {
            const res = await getPaymentHistory(page, 10, tab);
            const data = res.data;
            const list = data.list;
            setPaymentHistory(list);
            setTotalPages(data.totalPages);
        } catch (err) {
            if (err && typeof err === 'object' && 'status' in err) {
                console.log(err)
                alert('로그인이 필요해요.');
                router.push(`/login?redirect=${encodeURIComponent(window.location.origin + '/mypage/payment')}`);
            }
            return;
        }
    }, [page, tab, router])
    
    // 탭 변경
    const changeTab = (tabText:string) => {
        setTab(tabText.toUpperCase());
    }

    useEffect(() => {
        loadReservationHistory();
    }, [loadReservationHistory, tab])

    return (
        <div className='mypage all'>
            <div className={`wrapper pc`}>
                <div className='intro'></div>
                {/* Header */}
                <MypageHeader buddyInfo={buddyInfo} />
                <div className='contents'>
                    <div className='contents_inner'>
                        <MypageSideMenu />
                        <div className='contents_area'>
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
                                                    el.label === '취소완료' ?
                                                    <Button type="text" classnames={`border lightgray cancel`} onclick={() => viewDetails(el.id)} text="취소 상세" />
                                                    :
                                                    <Button type="text" classnames={`border lightgray cancel`} onclick={() =>  viewDetails(el.id)} text="결제 상세" />
                                                }
                                            </ProgramInMypage>
                                        ))
                                        }
                                    </>
                                }
                            </div>
                            <div className='paging'>
                                <ul>
                                    <li className={`${page === 0 ? 'disabled' : ''}`}>
                                        <Button type='img' classnames='prev' onclick={() => viewPrev()} text='이전' />
                                    </li>
                                    {
                                        Array.from({length: totalPages}, (_, index) => (
                                            <li key={index} className={`${page === index ? 'selected' : ''}`} onClick={() => viewPaging(index)}>{index + 1}</li>
                                        ))
                                    }
                                    <li className={`${page === totalPages || page === totalPages - 1 ? 'disabled' : ''}`}>
                                        <Button type='img' classnames='next' onclick={() => viewNext()} text='다음' />
                                    </li>
                                </ul>
                            </div>
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