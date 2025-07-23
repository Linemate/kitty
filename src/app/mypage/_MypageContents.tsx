'use client'
import { Button, TextButtonWithIcon } from 'components/common/Button';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import Title from 'components/Title/Title';
import useMobile from 'hooks/useMobile';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const MypageContents = () => {
    const [reservationHistory, setReservationHistory] = useState<any[]>([]);
    const [tab, setTab] = useState('waiting');
    const isMobile = useMobile();
    const router = useRouter();


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
        router.push(`/cancel/${id}?reservationId=${reservationId}`)
    };

    // 위치 확인하기
    const checkLocation = (id: string) => {};

    // 리뷰 남기러 가기
    const leaveReview = (id: string) => {};
    return (
        <div className="contents_area">            
            <div className="intro">
                <div>
                    <Title title={'My Events'} />
                </div>
                <TextButtonWithIcon classnames={'all'} type={'text'} text={'ALL'} onclick={viewMorePage} />
            </div>

            <div className="my_events">
                <div className={`my_event waiting ${tab === 'waiting' ? 'active' : ''}`} onClick={() => changeTab('waiting')}>
                    <div className="num">6</div>
                    <div className="text">Waiting</div>
                </div>
                <div className={`my_event attended ${tab === 'attended' ? 'active' : ''}`} onClick={() => changeTab('attended')}>
                    <div className="num">12</div>
                    <div className="text">Attended</div>
                </div>
            </div>
            <div className="programs">
                {/* 모임 리스트가 있을 때 */}
                <div className="list">
                    {/* Waiting */}
                    <ProgramInMypage id={1} name={'MAKE A TRADITIONAL FOOD WITH KOREAN FRIENDS'} status={'waiting'} applyDate={'02.12(Mon)'} date={'2024.02.12(Mon) 1:00 PM '} location={'Gangnam Station'}>
                        <Button type="text" classnames={`border lightgray programs cancel ${isMobile ? 'wide' : ''}`} onclick={() => cancelProgram(1, 1)} text="Cancel" />
                    </ProgramInMypage>
                    {/* Attended */}
                    <ProgramInMypage id={4} name={'MAKE A TRADITIONAL FOOD WITH KOREAN FRIENDS'} status={'attended'} applyDate={'02.12(Mon)'} date={'2024.02.12(Mon) 1:00 PM '} location={'Gangnam Station'}>
                        <Button type="text" classnames={`border blue review ${isMobile ? 'wide' : ''}`} onclick={() => leaveReview('3')} text="Leave Review" />
                    </ProgramInMypage>
                </div>
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
            </div>
        </div>
    );
};

export default MypageContents;