'use client'
import { getReservationHistory } from 'api';
import Header from 'components/Header/Header';
import ModalPortal from 'components/Portal/ModalPortal';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import Title from 'components/Title/Title';
import { Button } from 'components/common/Button';
import useMobile from 'hooks/useMobile';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/mypage.scss';
import { reservationHistoryProps } from 'types/types';
import { useRouter } from 'next/navigation';

const MyAllReservations = () => {
    const [reservationHistory, setReservationHistory] = useState<reservationHistoryProps[]>([]);
    const [isModal, setIsModal] = useState<boolean>(false);
    const [tab, setTab] = useState('upcoming');
    const isMobile = useMobile();
    const router = useRouter();

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
    
    // 탭 변경
    const changeTab = (tabText:string) => {
        setTab(tabText);
    }

    // 모임 둘러보기 페이지로 이동
    const viewProgramsPage = () => {
        router.push('/');
    };

    // 취소
    const cancelProgram = (id:number, reservationId:number) => {
        router.push(`/cancel/${id}?programId=${id}&reservationId=${reservationId}`)
    }

    // 위치 확인
    const checkLocation = (id:string) => {
        setIsModal(true);
    }

    // 리뷰 남기기
    const leaveReview = (id:string) => {
        
    }

    // 취소 정보 확인하기
    const viewCancelDetail = (id:string) => {
        
    }

    // paging
    const viewPaging = (num:number) => {
    
    }

    // 페이징 왼쪽 방향 버튼
    const viewPrev = () => {
        
    }

    // 페이징 오른쪽 방향 버튼
    const viewNext = () => {
    
    }

    // 모달 제거
    const closePortal = () => {
        setIsModal(false);
    }
    
    useEffect(() => {
        loadReservationHistory();
    }, [loadReservationHistory, tab])

    return (
        <div className='mypage all'>
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                <div className='intro'></div>
                {/* Header */}
                <Header title={'My Events'} isDepth={true} />
                <div className='contents'>
                    <div className='contents_inner'>
                        <div className='tab_area'>
                            <div className='tab rounded'>
                                <ul>
                                    <li className={`${tab === 'upcoming' ? 'selected' : ''}`} onClick={() => changeTab('upcoming')}>Upcoming</li>
                                    <li className={`${tab === 'attended' ? 'selected' : ''}`} onClick={() => changeTab('attended')}>Attended</li>
                                    <li className={`${tab === 'canceled' ? 'selected' : ''}`} onClick={() => changeTab('canceled')}>Canceled</li>
                                </ul> 
                            </div>
                        </div>
                        <div className='contents_area'>
                            <div className='programs'>
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
                                                        </>
                                                    }
                                                </ProgramInMypage>
                                            )
                                        }
                                    </>
                                }
                                {/* Waiting */}
                                {/* <ProgramInMypage id={1} title={'MAKE A TRADITIONAL FOOD WITH KOREAN FRIENDS'} status={'waiting'} createdAt={'2024.02.12(Mon) 1:00 PM '} station={'Gangnam Station'}>
                                    <Button type='text' classnames={`border lightgray programs cancel ${isMobile ? 'wide' : ''}`} onclick={() => cancelProgram('1')} text='Cancel' />
                                </ProgramInMypage> */}
                                {/* Cancel Request */}
                                {/* <ProgramInMypage id={1} title={'MAKE A TRADITIONAL FOOD WITH KOREAN FRIENDS'} status={'request'} createdAt={'2024.02.12(Mon) 1:00 PM '} station={'Gangnam Station'}>
                                    <Button type='text' classnames={`bg_darkgray programs cancel ${isMobile ? 'wide' : ''}`} onclick={() => cancelProgram('1')} text='Cancel' />
                                </ProgramInMypage> */}
                                {/* Attended */}
                                {/* <ProgramInMypage id={4} title={'MAKE A TRADITIONAL FOOD WITH KOREAN FRIENDS'} status={'attended'} createdAt={'2024.02.12(Mon) 1:00 PM '} station={'Gangnam Station'}>
                                    <Button type='text' classnames={`border blue review ${isMobile ? 'wide' : ''}`} onclick={() => leaveReview('3')} text='Leave Review' />
                                </ProgramInMypage> */}
                                {/* Canceled */}
                                {/* <ProgramInMypage id={4} title={'MAKE A TRADITIONAL FOOD WITH KOREAN FRIENDS'} status={'canceled'} createdAt={'2024.02.12(Mon) 1:00 PM '} station={'Gangnam Station'}>
                                        <Button type='text' classnames={`border lightgray programs cancel ${isMobile ? 'wide' : ''}`} onclick={() => viewCancelDetail('3')} text='Cancel Detail' />
                                </ProgramInMypage> */}
                            </div>
                            <div className='paging'>
                                <ul>
                                    <li className='disabled'>
                                        <Button type='img' classnames='prev' onclick={() => viewPrev()} text='이전' />
                                    </li>
                                    <li className='selected' onClick={() => viewPaging(1)}>1</li>
                                    <li>2</li>
                                    <li>3</li>
                                    <li>4</li>
                                    <li>5</li>
                                    <li>6</li>
                                    <li>7</li>
                                    <li>8</li>
                                    <li>9</li>
                                    <li className=''>
                                        <Button type='img' classnames='next' onclick={() => viewNext()} text='다음' />
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
                {
                    isModal &&
                    <ModalPortal title='모임 안내' type='program_intro' closePortal={closePortal}>
                        <div>
                            ddd
                        </div>
                    </ModalPortal>
                }
            </div>
        </div>
    );
};

export default MyAllReservations;