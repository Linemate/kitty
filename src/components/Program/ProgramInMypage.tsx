'use client'
import React, { ReactElement } from 'react';
import 'styles/program.scss';
import { programInMypageProps } from 'types/types';
import useMobile from 'hooks/useMobile';
import { Button } from 'components/common/Button';


const ProgramInMypage = (props:programInMypageProps) => {
    const {programId, reservationId, label, paymentsStatus, reservationStatus, title, thumbnail, startDate, station, type, children } = props;
    const isMobile = useMobile();

    const checkLocation = (id:number) => {
        console.log('checkLocation');
    }

    const formatDate = () => {
        const dateObj = new Date(startDate);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        return `${year}.${month}.${day}`;
    }


    return (
        <div className={`item ${isMobile ? 'mobile' : ''}`}>
            <div className='item_desc_area'>
                <div className='img_area' style={{backgroundImage: `url(${thumbnail})`}}>
                </div>
                <div className='text_area'>
                    {
                        type === 'simple' ?
                        ''
                        :
                        <div className='program_state'>
                            <span className={`approve_status ${label === '참여예정' ? 'waiting' : label === '취소요청' ? 'request' : 'attended'}`}>{label}</span>
                        </div>
                    }
                    <div className='program_name'>
                        <div className='ellipsis'>
                            {title}
                        </div>
                    </div>
                    <div className='program_date'>
                        {formatDate()}
                    </div>
                    <div className='program_place'>
                        <div className='ico location gray'>{station}</div> 
                    </div> 
                </div>
            </div>
            <div className='btn_wrapper'>
                <Button type='text' classnames={`blue right_arrow`} onclick={() => checkLocation(programId)} text='Check Location' />
                {
                    children ? 
                    <div className='btn_area'>
                        {children}
                    </div>
                    : <></>
                }
            </div>
        </div>
    );
};

export default ProgramInMypage;