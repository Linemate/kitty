'use client'
import { getReservationHistory } from 'api';
import Header from 'components/Header/Header';
import ModalPortal from 'components/Portal/ModalPortal';
import InfoOfProgram from 'components/Program/InfoOfProgram';
import AddReview from 'components/Review/_Add';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import { Button } from 'components/common/Button';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/mypage.scss';
import { buddyProfileProps, reservationHistoryProps } from 'types/types';
import { useRouter } from 'next/navigation';
import MyPageTab from './_Tab';
import { useAuthStore } from 'utils/stores';
import Paging from 'components/common/Paging';
import { t } from "utils/i18n";

const MyAllReservationsMobile = ({ buddyInfo }: { buddyInfo: buddyProfileProps | null }) => {
    const [reservationHistory, setReservationHistory] = useState<reservationHistoryProps[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [tab, setTab] = useState('UPCOMING');
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
    }, [tab, page])

    // 탭 변경
    const changeTab = (tabText: string) => {
        setTab(tabText.toUpperCase());
    }

    // 모임 둘러보기 페이지로 이동
    const viewProgramsPage = () => {
        router.push('/');
    };

    // 취소
    const cancelProgram = (id: number, reservationId: number) => {
        router.push(`/cancel/${id}?reservationId=${reservationId}&price=${0}`)
    }

    const [modal, setModal] = useState({ open: false, programId: 0 });

    // 리뷰 남기기
    const leaveReview = (id: number) => {
        setModal({
            open: true,
            programId: id
        });
    }

    const closeModal = () => {
        setModal({
            open: false,
            programId: 0
        });
    }

    const [isInfoOfProgram, setIsInfoOfProgram] = useState({ open: false, programId: 0, reservationId: 0 });

    const checkLocation = (el:reservationHistoryProps) => {
        setIsInfoOfProgram({ open: true, programId: el.programId!, reservationId: el.reservationId! });
    }

    const changePage = (num: number) => {
        setPage(num);
    }

    useEffect(() => {
        loadReservationHistory();
    }, [loadReservationHistory, tab, page])

    useEffect(() => {
        setPage(0);
    }, [tab])

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
                                                reservationHistory.map((el: reservationHistoryProps, index: number) =>
                                                    <ProgramInMypage key={index} reservation={el}>
                                                        {
                                                            el.label === "참여예정" ?
                                                                <>
                                                                    <Button type="text" classnames={`border lightgray programs cancel wide`} onclick={() => cancelProgram(el.programId!, el.reservationId!)} text="Cancel" />
                                                                    <Button type='text' classnames={`border blue programs check_location wide`} onclick={() => checkLocation(el)} text='Check Location' />
                                                                </>
                                                                :
                                                                <>
                                                                    {
                                                                        el.label === "참여완료" ?
                                                                            <Button type="text" classnames={`border blue review wide`} onclick={() => leaveReview(el.programId!)} text="Leave Review" />
                                                                            : ''
                                                                    }
                                                                </>
                                                        }
                                                    </ProgramInMypage>
                                                )
                                            }
                                        </>
                                }
                            </div>
                            {
                                reservationHistory.length > 0 &&
                                <Paging totalPages={totalPages} page={page} changePage={changePage} />
                            }
                        </div>

                    </div>
                </div>
            </div>
            {
                isInfoOfProgram.open && (
                    <InfoOfProgram 
                        handleClose={() => setIsInfoOfProgram({ ...isInfoOfProgram, open: false })} 
                        programId={isInfoOfProgram.programId} 
                        reservationId={isInfoOfProgram.reservationId} 
                    />
                )
            }
            {
                modal.open && <AddReview id={modal.programId || 0} closePortal={closeModal} />
            }
        </div>
    );
};

export default MyAllReservationsMobile;