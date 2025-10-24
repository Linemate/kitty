'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { buddyProfileProps, reservationHistoryProps } from 'types/types';
import { useRouter } from 'next/navigation';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import { getReservationHistory } from 'api';
import MyPageTab from './_Tab';
import MypageHeader from '../_MypageHeader';
import MypageSideMenu from '../_MypageSideMenu';
import Footer from 'components/Footer/Footer';
import { Button } from 'components/common/Button';
import Paging from 'components/common/Paging';

const MyAllReservationsPC = ({buddyInfo}: {buddyInfo: buddyProfileProps | null}) => {
    const [reservationHistory, setReservationHistory] = useState<reservationHistoryProps[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [tab, setTab] = useState('UPCOMING');
    const router = useRouter();

    const changePage = (num:number) => {
        setPage(num);
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

    // 모임 둘러보기 페이지로 이동
    const viewProgramsPage = () => {
        router.push('/');
    };

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
                                                <Button type="text" classnames={`border lightgray around fit`} onclick={viewProgramsPage} text="Explore Meetings" />
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                    {
                                        reservationHistory.map((el:reservationHistoryProps, index:number) => (
                                            <ProgramInMypage key={index} reservation={el} />
                                        ))
                                        }
                                    </>
                                }
                            </div>
                            <Paging totalPages={totalPages} page={page} changePage={changePage} />
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