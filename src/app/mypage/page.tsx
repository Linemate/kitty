'use client';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import Title from 'components/Title/Title';
import { Button, TextButtonWithIcon } from 'components/common/Button';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import 'styles/mypage.scss';
const MyPage = () => {
    const [tab, setTab] = useState('upcoming');
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
    const cancelProgram = (id: string) => {};

    // 위치 확인하기
    const checkLocation = (id: string) => {};

    // 리뷰 남기러 가기
    const leaveReview = (id: string) => {};

    return (
        <div>
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
                <div className={`my_event upcoming ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => changeTab('upcoming')}>
                    <div className="num">0</div>
                    <div className="text">Upcoming</div>
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
                        <Button type="text" classnames="border lightgray programs cancel" onclick={() => cancelProgram('1')} text="Cancel" />
                    </ProgramInMypage>
                    {/* Upcoming */}
                    <ProgramInMypage id={2} name={'MAKE A TRADITIONAL FOOD WITH KOREAN FRIENDS'} status={'upcoming'} applyDate={'02.12(Mon)'} date={'2024.02.12(Mon) 1:00 PM '} location={'Gangnam Station'}>
                        <>
                            <Button type="text" classnames="blue ico arrow_right" onclick={() => checkLocation('2')} text="Check Location" />
                            <Button type="text" classnames="border lightgray programs cancel" onclick={() => cancelProgram('2')} text="Cancel" />
                        </>
                    </ProgramInMypage>
                    {/* Attended */}
                    <ProgramInMypage id={4} name={'MAKE A TRADITIONAL FOOD WITH KOREAN FRIENDS'} status={'attended'} applyDate={'02.12(Mon)'} date={'2024.02.12(Mon) 1:00 PM '} location={'Gangnam Station'}>
                        <Button type="text" classnames="border blue review" onclick={() => leaveReview('3')} text="Leave Review" />
                    </ProgramInMypage>
                </div>
                {/* 모임 리스트가 비었을 때 */}
                <div className="nothing">
                    <div className="bg">
                        <div className="notice">
                            <p className="first_line">현재 신청한 모임이 없습니다.</p>
                            <p>지금 라인메이트의 모임을 둘러보세요!</p>
                        </div>
                        <Button type="text" classnames="border lightgray programs" onclick={viewProgramsPage} text="모임 둘러보기" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
