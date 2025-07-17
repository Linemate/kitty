'use client'
import Header from 'components/Header/Header';
import ModalPortal from 'components/Portal/ModalPortal';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import Title from 'components/Title/Title';
import { Button } from 'components/common/Button';
import useMobile from 'hooks/useMobile';
import React, { useState } from 'react';
import 'styles/mypage.scss';

const MyAllReservations = () => {
    const [isModal, setIsModal] = useState<boolean>(false);
    const isMobile = useMobile();
    // 취소
    const cancelProgram = (id:string) => {
        
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

    return (
        <div className='all'>
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                <div className='intro'></div>
                {/* Header */}
                <Header title={'My Events'} isDepth={true} />
                
                <div className='tab_area'>
                    <div className='tab rounded'>
                        <ul>
                            <li className='selected'>Waiting</li>
                            <li>Upcoming</li>
                            <li>Attended</li>
                            <li>Canceled</li>
                        </ul>
                    </div>
                </div>
                <div className='programs'>
                    <div className='list'>
                        {/* Waiting */}
                        <ProgramInMypage id={1} name={'MAKE A TRADITIONAL FOOD WITH KOREAN FRIENDS'} status={'waiting'} applyDate={'02.12(Mon)'} date={'2024.02.12(Mon) 1:00 PM '} location={'Gangnam Station'}>
                            <Button type='text' classnames='border lightgray programs cancel' onclick={() => cancelProgram('1')} text='Cancel' />
                        </ProgramInMypage>
                        {/* Upcoming */}
                        <ProgramInMypage id={2} name={'MAKE A TRADITIONAL FOOD WITH KOREAN FRIENDS'} status={'upcoming'} applyDate={'02.12(Mon)'} date={'2024.02.12(Mon) 1:00 PM '} location={'Gangnam Station'}>
                            <>
                                <Button type='text' classnames='blue ico arrow_right' onclick={() => checkLocation('2')} text='Check Location' />
                                <Button type='text' classnames='border lightgray programs cancel' onclick={() => cancelProgram('2')} text='Cancel' />
                            </>
                        </ProgramInMypage>
                        {/* Attended */}
                        <ProgramInMypage id={4} name={'MAKE A TRADITIONAL FOOD WITH KOREAN FRIENDS'} status={'attended'} applyDate={'02.12(Mon)'} date={'2024.02.12(Mon) 1:00 PM '} location={'Gangnam Station'}>
                            <Button type='text' classnames='border blue review' onclick={() => leaveReview('3')} text='Leave Review' />
                        </ProgramInMypage>
                        {/* Canceled */}
                        <ProgramInMypage id={4} name={'MAKE A TRADITIONAL FOOD WITH KOREAN FRIENDS'} status={'canceled'} applyDate={'02.12(Mon)'} date={'2024.02.12(Mon) 1:00 PM '} location={'Gangnam Station'}>
                                <Button type='text' classnames='border lightgray programs cancel' onclick={() => viewCancelDetail('3')} text='Cancel Detail' />
                        </ProgramInMypage>
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