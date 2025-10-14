'use client'
import { getPaymentHistory, getReservationHistory } from 'api';
import Header from 'components/Header/Header';
import ModalPortal from 'components/Portal/ModalPortal';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import { Button } from 'components/common/Button';
import useMobile from 'hooks/useMobile';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/mypage.scss';
import { buddyProfileProps, reservationHistoryProps } from 'types/types';
import { useRouter } from 'next/navigation';
import { useAuthStore } from 'utils/stores';
import MyHistoryTab from './_Tab';

const MyPaymentHistoryMobile = ({buddyInfo}: {buddyInfo: buddyProfileProps | null}) => {
    const [reservationHistory, setReservationHistory] = useState<reservationHistoryProps[]>([]);
    const [isModal, setIsModal] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [tab, setTab] = useState('UPCOMING');
    const isMobile = useMobile();
    const router = useRouter();

    // 로그인 여부
    const userInfo = useAuthStore.getState().userInfo;

    // 결제 내역
    const loadPaymentHistory = useCallback(async () => {
        try {
            const res = await getPaymentHistory(page, 10, '');
            const data = res.data;
            const list = data.list;
            setReservationHistory(list);
            setTotalPages(data.totalPages);
            console.log(list)
        } catch (err) {
            if (err && typeof err === 'object' && 'status' in err) {
                console.log(err)
                alert('로그인이 필요해요.');
                router.push(`/login?redirect=${encodeURIComponent(window.location.origin + '/mypage/payment')}`);
            }
            return;
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
        setPage(num - 1);
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
        loadPaymentHistory();
    }, [loadPaymentHistory, tab, page])

    useEffect(() => {
        setPage(0);
    }, [tab])

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
                                    reservationHistory.length === 0 ? 
                                    <>
                                        {/* 결제 내역이 비었을 때 */}
                                        <div className="nothing">
                                            <div className='ico payment'><p>결제 내역이 없습니다.</p></div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        {
                                            reservationHistory.map((el:reservationHistoryProps, index:number) => 
                                                <ProgramInMypage key={index} reservation={el}>
                                                    {
                                                        el.label === '취소완료' ?
                                                        <Button type="text" classnames={`border lightgray programs cancel wide`} onclick={() => cancelProgram(el.programId, el.reservationId)} text="Cancel" />
                                                        :
                                                        <Button type="text" classnames={`border blue review wide`} onclick={() => leaveReview('3')} text="Leave Review" />
                                                    }
                                                </ProgramInMypage>
                                            )
                                        }
                                    </>
                                }
                            </div>
                            {
                                reservationHistory.length > 0 &&
                                <div className='paging'>
                                    <ul>
                                        <li className={`${page === 1 ? 'disabled' : ''}`}>
                                            <Button type='img' classnames='prev' onclick={() => viewPrev()} text='이전' />
                                        </li>
                                        {
                                            Array.from({length: totalPages}, (_, index) => (
                                                <li key={index} className={`${page === index ? 'selected' : ''}`} onClick={() => viewPaging(index + 1)}>{index + 1}</li>
                                            ))
                                        }
                                        <li className={`${page === totalPages || page === totalPages - 1 ? 'disabled' : ''}`}>
                                            <Button type='img' classnames='next' onclick={() => viewNext()} text='다음' />
                                        </li>
                                    </ul>
                                </div>
                            }
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

export default MyPaymentHistoryMobile;