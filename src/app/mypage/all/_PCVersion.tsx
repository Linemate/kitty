'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { buddyProfileProps, reservationHistoryProps } from 'types/types';
import { useRouter } from 'next/navigation';
import AddReview from 'components/Review/_Add';
import EditReview from 'components/Review/_Edit';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import { getReservationHistory, getMyReviewList } from 'api';
import MyPageTab from './_Tab';
import MypageHeader from '../_MypageHeader';
import MypageSideMenu from '../_MypageSideMenu';
import Footer from 'components/Footer/Footer';
import { Button } from 'components/common/Button';
import Paging from 'components/common/Paging';
import ModalPortal from 'components/Portal/ModalPortal';
import InfoOfProgram from 'components/Program/InfoOfProgram';
import { t } from "utils/i18n";

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

    const [isInfoOfProgram, setIsInfoOfProgram] = useState({ open: false, programId: 0, reservationId: 0 });

    const checkLocation = (el:reservationHistoryProps) => {
        setIsInfoOfProgram({ open: true, programId: el.programId!, reservationId: el.reservationId! });
    }

    // 취소
    const cancelProgram = (el:reservationHistoryProps) => {
        router.push(`/cancel/${el.programId}?reservationId=${el.reservationId}&price=${0}`)
    }

    const [modal, setModal] = useState({ open: false, programId: 0, isEdit: false, content: '', score: 0, reviewId: 0 });

    // 리뷰 남기기
    const leaveReview = (id:number) => {
        setModal({
            open: true,
            programId: id,
            isEdit: false,
            content: '',
            score: 0,
            reviewId: 0
        });
    }

    // 리뷰 수정하기
    const openEditReview = async (id: number) => {
        try {
            const res = await getMyReviewList(0, 100);
            const list = res.data.list;
            const review = list.find((el: any) => el.programId === id);
            if (review) {
                setModal({ 
                    open: true, 
                    programId: id, 
                    isEdit: true, 
                    content: review.content, 
                    score: review.score, 
                    reviewId: review.id 
                });
            } else {
                alert(t("리뷰 정보를 찾을 수 없습니다."));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const closeModal = () => {
        setModal({
            open: false,
            programId: 0,
            isEdit: false,
            content: '',
            score: 0,
            reviewId: 0
        });
    }

    const handleReviewSuccess = () => {
        loadReservationHistory();
        closeModal();
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
                                            <ProgramInMypage key={index} reservation={el}>
                                                {
                                                    tab === 'UPCOMING' ?
                                                        <>
                                                            <Button type="text" classnames={`border lightgray programs cancel`} onclick={() => cancelProgram(el)} text="Cancel" />
                                                            <Button type='text' classnames={`border blue programs check_location`} onclick={() => checkLocation(el)} text='Check Location' />
                                                        </>
                                                        :
                                                        tab === 'COMPLETED' ?
                                                            <>
                                                                {el.hasReviewed ? (
                                                                    <Button type="text" classnames={`border blue review`} onclick={() => openEditReview(el.programId!)} text="Edit Review" />
                                                                ) : (
                                                                    <Button type="text" classnames={`border blue review`} onclick={() => leaveReview(el.programId!)} text="Leave Review" />
                                                                )}
                                                            </>
                                                            :
                                                            el.label === "취소요청" ?
                                                                <Button type="text" classnames={`bg_darkgray programs cancel`} onclick={() => cancelProgram(el)} text="Cancel" />
                                                                :
                                                                null
                                                }
                                            </ProgramInMypage>
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
                // 문의하기
                modal.open && (modal.isEdit ? (
                    <EditReview reviewId={modal.reviewId} programId={modal.programId} content={modal.content} score={modal.score} closePortal={closeModal} onSuccess={handleReviewSuccess} />
                ) : (
                    <AddReview id={modal.programId || 0} closePortal={closeModal} onSuccess={handleReviewSuccess} />
                ))
            }
        </div>
    );
};

export default MyAllReservationsPC;