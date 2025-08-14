'use client'
import Header from 'components/Header/Header';
import React, { useCallback, useEffect, useState } from 'react';
import { reservationHistoryProps } from 'types/types';
import { useRouter } from 'next/navigation';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import { getReservationHistory } from 'api';
import MyPageTab from './_Tab';
import MypageHeader from '../_MypageHeader';
import MypageSideMenu from '../_MypageSideMenu';
import Footer from 'components/Footer/Footer';
import { Button } from 'components/common/Button';

const MyAllReservationsPC = () => {
    const [reservationHistory, setReservationHistory] = useState<reservationHistoryProps[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [tab, setTab] = useState('UPCOMING');
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
    // 프로그램 신청 내역
    const loadReservationHistory = useCallback(async () => {
        try {
            const res = await getReservationHistory(page, 10, tab);
            const data = res.data;
            const list = data.list;
            setReservationHistory(list);
            setTotalPages(data.totalPages);
            console.log(list)
        } catch (err) {
            console.log(err);
        }
    }, [tab, page])
    
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
                <MypageHeader />
                <div className='contents'>
                    <div className='contents_inner'>
                        <MypageSideMenu />
                        <div className='contents_area'>
                            <MyPageTab tab={tab} changeTab={changeTab} />
                            <div className='programs'>
                                {
                                    reservationHistory.length === 0 ? 
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
                                        reservationHistory.map((el:reservationHistoryProps, index:number) => (
                                            <ProgramInMypage key={index} programId={el.programId} reservationId={el.reservationId} label={el.label} paymentsStatus={el.paymentsStatus} reservationStatus={el.reservationStatus} title={el.title} thumbnail={el.thumbnail} startDate={el.startDate} station={el.station} createdAt={el.createdAt} updatedAt={el.updatedAt} />
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
                                            <li key={index} className={`${page === index ? 'selected' : ''}`} onClick={() => viewPaging(index)}>{index}</li>
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

export default MyAllReservationsPC;