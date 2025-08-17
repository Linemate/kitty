'use client'
import { getReservationHistory } from 'api';
import Header from 'components/Header/Header';
import ModalPortal from 'components/Portal/ModalPortal';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import { Button } from 'components/common/Button';
import useMobile from 'hooks/useMobile';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/mypage.scss';
import { reservationHistoryProps } from 'types/types';
import { useRouter } from 'next/navigation';
import MyPageTab from './_Tab';
import { useAuthStore } from 'utils/stores';

const MyAllReservationsMobile = () => {
    const [reservationHistory, setReservationHistory] = useState<reservationHistoryProps[]>([]);
    const [isModal, setIsModal] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [tab, setTab] = useState('UPCOMING');
    const isMobile = useMobile();
    const router = useRouter();

    // 로그인 여부
    const userInfo = useAuthStore.getState().userInfo;

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
    }, [tab])  
    
    // 탭 변경
    const changeTab = (tabText:string) => {
        setTab(tabText.toUpperCase());
    }

    // 모임 둘러보기 페이지로 이동
    const viewProgramsPage = () => {
        router.push('/');
    };

    // 취소
    const cancelProgram = (id:number, reservationId:number) => {
        router.push(`/cancel/${id}?reservationId=${reservationId}&price=${0}`)
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

    // 모달 제거
    const closePortal = () => {
        setIsModal(false);
    }
    
    useEffect(() => {
        loadReservationHistory();
    }, [loadReservationHistory, tab])

    return (
        <div className='mypage all'>
            <div className={`wrapper mobile`}>
                <div className='intro'></div>
                {/* Header */}
                <Header title={'My Events'} isDepth={true} isLogin={userInfo !== null} />
                <div className='contents'>
                    <div className='contents_inner'>
                        <MyPageTab tab={tab} changeTab={changeTab} />
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
                                                <ProgramInMypage key={index} programInMypage={el}>
                                                    {
                                                        el.label === '참여예정' ?
                                                        <Button type="text" classnames={`border lightgray programs cancel ${isMobile ? 'wide' : ''}`} onclick={() => cancelProgram(el.programId, el.reservationId)} text="Cancel" />
                                                        :
                                                        <>
                                                            {
                                                                el.label === '참여완료'?
                                                                <Button type="text" classnames={`border blue review ${isMobile ? 'wide' : ''}`} onclick={() => leaveReview('3')} text="Leave Review" />
                                                                :''
                                                            }
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
                                    <li className={`${page === 1 ? 'disabled' : ''}`}>
                                        <Button type='img' classnames='prev' onclick={() => viewPrev()} text='이전' />
                                    </li>
                                    {
                                        Array.from({length: totalPages}, (_, index) => (
                                            <li key={index} className={`${page === index + 1 ? 'selected' : ''}`} onClick={() => viewPaging(index + 1)}>{index + 1}</li>
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

export default MyAllReservationsMobile;