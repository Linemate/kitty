'use client'
import { getReservationHistory, getReservationHistoryCount } from 'api';
import { Button, TextButtonWithIcon } from 'components/common/Button';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import Title from 'components/Title/Title';
import useMobile from 'hooks/useMobile';
import { useRouter } from 'next/navigation';
import React, { use, useCallback, useEffect, useState } from 'react';
import { reservationHistoryProps } from 'types/types';

const MypageContents = () => {
    const [reservationHistoryCount, setReservationHistoryCount] = useState({
        upcoming: 0,
        completed: 0
    });
    const [reservationHistory, setReservationHistory] = useState<any[]>([]);
    const [tab, setTab] = useState('UPCOMING');
    const isMobile = useMobile();
    const router = useRouter();

    // 프로그램 신청 내역 집계 조회
    const loadReservationHistoryCount = useCallback(async () => {
        try {
            const res = await getReservationHistoryCount();
            const data = res.data;
            setReservationHistoryCount(data);
        } catch (err) {
            console.log(err);
        }
    }, [])

    // 프로그램 신청 내역
    const loadReservationHistory = useCallback(async () => {
        try {
            const res = await getReservationHistory(0, 2, tab);
            const list = res.data.list;
            setReservationHistory(list);
        } catch (err) {
            console.log(err);
        }
    }, [tab])   

    // 전체보기로 이동
    const viewMorePage = () => {
        router.push('/mypage/all');
    };
    // 모임 둘러보기 페이지로 이동
    const viewProgramsPage = () => {
        router.push('/');
    };

    // 탭 변경
    const changeTab = (tabText: string) => {
        setTab(tabText);
    };

    // 취소
    const cancelProgram = (id: number, reservationId: number) => {
        // 결제한 paymentsHistoryId가 필요한데..
        router.push(`/cancel/${id}?programId=${id}&reservationId=${reservationId}`)
    };

    // 위치 확인하기
    const checkLocation = (id: string) => {};

    // 리뷰 남기러 가기
    const leaveReview = (id: string) => {};

    useEffect(() => {
        loadReservationHistory();
    }, [loadReservationHistory, tab])

    useEffect(() => {
        loadReservationHistoryCount();
    }, [loadReservationHistoryCount])

    return (
        <div className="contents_area">            
            <div className="intro">
                <div>
                    <Title title={'My Events'} />
                </div>
                <TextButtonWithIcon classnames={'all'} type={'text'} text={'ALL'} onclick={viewMorePage} />
            </div>

            <div className="my_events">
                <div className={`my_event waiting ${tab === 'UPCOMING' ? 'active' : ''}`} onClick={() => changeTab('UPCOMING')}>
                    <div className="num">{reservationHistoryCount.upcoming}</div>
                    <div className="text">Waiting</div>
                </div>
                <div className={`my_event attended ${tab === 'COMPLETED' ? 'active' : ''}`} onClick={() => changeTab('COMPLETED')}>
                    <div className="num">{reservationHistoryCount.completed}</div>
                    <div className="text">Attended</div>
                </div>
            </div>
            <div className="programs">
                {/* 모임 리스트가 있을 때 */}
                <div className="list">
                    {
                        reservationHistory.length === 0 ? 
                        <>
                        {/* 모임 리스트가 비었을 때 */}
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
                                reservationHistory.map((el:reservationHistoryProps, index:number) => 
                                    <ProgramInMypage key={index} programId={el.id} reservationId={el.reservationId} label={el.label} paymentsStatus={el.paymentsStatus} reservationStatus={el.reservationStatus} title={el.title} thumbnail={el.thumbnail} startDate={el.startDate} station={el.station} createdAt={el.createdAt} updatedAt={el.updatedAt}>
                                        {
                                            el.label === '참여예정' ?
                                            <Button type="text" classnames={`border lightgray programs cancel ${isMobile ? 'wide' : ''}`} onclick={() => cancelProgram(el.id, el.reservationId)} text="Cancel" />
                                            :
                                            <>
                                                {
                                                el.label === '참여완료' ?
                                                <Button type="text" classnames={`border blue review ${isMobile ? 'wide' : ''}`} onclick={() => leaveReview(el.id.toString())} text="Leave Review" />
                                                :
                                                el.label === '취소요청' ?
                                                <Button type="text" classnames={`bg_darkgray programs cancel ${isMobile ? 'wide' : ''}`} onclick={() => cancelProgram(el.id, el.reservationId)} text="Cancel" />
                                                :
                                                ''
                                                }
                                            </>
                                        }
                                    </ProgramInMypage>
                                )
                            }
                        </>
                    }
                    {/* Waiting */}
                    {/* <ProgramInMypage id={1} name={'MAKE A TRADITIONAL FOOD WITH KOREAN FRIENDS'} status={'waiting'} applyDate={'02.12(Mon)'} date={'2024.02.12(Mon) 1:00 PM '} location={'Gangnam Station'}>
                        <Button type="text" classnames={`border lightgray programs cancel ${isMobile ? 'wide' : ''}`} onclick={() => cancelProgram(1)} text="Cancel" />
                    </ProgramInMypage> */}
                    {/* Attended */}
                    {/* <ProgramInMypage id={4} name={'MAKE A TRADITIONAL FOOD WITH KOREAN FRIENDS'} status={'attended'} applyDate={'02.12(Mon)'} date={'2024.02.12(Mon) 1:00 PM '} location={'Gangnam Station'}>
                        <Button type="text" classnames={`border blue review ${isMobile ? 'wide' : ''}`} onclick={() => leaveReview('3')} text="Leave Review" />
                    </ProgramInMypage> */}
                </div>
            </div>
        </div>
    );
};

export default MypageContents;