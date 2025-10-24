'use client'
import React, { ReactElement, useState } from 'react';
import 'styles/program.scss';
import { programInMypageProps } from 'types/types';
import useMobile from 'hooks/useMobile';
import { Button } from 'components/common/Button';
import InfoOfProgram from './InfoOfProgram';

export const initProgramInMypage = {
    label: '',
    paymentsStatus: '',
    reservationStatus: '',
    startDate: '',
    createdAt: '',
    updatedAt: '',
    programId:0,
    reservationId:0,
    thumbnail: '',
    station: '',
    title: '',
    price: 0,
    currency: ''
}

export const initPaymentHistory = {
    id: 0,
    status: '',
    orderId: '',
    totalAmount: 0,
    label: '',
    reservation: {
        label: '',
        reservationStatus: '',
        paymentsStatus: '',
        startDate: '',
        createdAt: '',
        updatedAt: ''
    },
    method:''
}

const ProgramInMypage = (props:programInMypageProps) => {
    const { label, reservation, type, children } = props;
    const { programId, reservationId, label:reservationLabel, startDate, createdAt, updatedAt, thumbnail, station, title, price, currency } = reservation;
    const isMobile = useMobile();
    const [isInfoOfProgram, setIsInfoOfProgram] = useState<boolean>(false);

    const checkLocation = () => {
        setIsInfoOfProgram(true);
    }

    return (
        <div className={`item ${isMobile ? 'mobile' : ''}`}>
            {
                type === 'payment' &&
                <div className='payment_status_area'>
                    {label}<span className='payment_date'>{updatedAt}</span>
                </div>
            }
            <div className='item_area'>
                <div className='item_desc_area'>
                    <div className='img_area' style={{backgroundImage: `url(${thumbnail})`}}>
                    </div>
                    <div className='text_area'>
                        {
                            type === 'simple' ?
                            ''
                            :
                            <div className='program_state'>
                                <span className={`approve_status ${reservationLabel === '참여예정' ? 'waiting' : reservationLabel === '취소요청' ? 'request' :  reservationLabel === '취소완료' ? 'canceled' :'attended'}`}>{reservationLabel}</span>
                            </div>
                        }
                        <div className='program_name'>
                            <div className='ellipsis'>
                                {title}
                            </div>
                        </div>
                        <div className='program_date'>
                            {updatedAt}
                        </div>
                        <div className='program_place'>
                            <div className='ico location gray'>{station}</div> 
                        </div> 
                    </div>
                </div>
                <div className='btn_wrapper'>
                    {
                        reservationLabel === '참여예정' &&
                        <Button type='text' classnames={`blue right_arrow`} onclick={checkLocation} text='Check Location' />
                    }
                    {
                        children ? 
                        <div className='btn_area'>
                            {children}
                        </div>
                        : <></>
                    }
                </div>
                {
                    isInfoOfProgram && <InfoOfProgram handleClose={() => setIsInfoOfProgram(false)} programId={programId!} reservationId={reservationId!} />
                }
            </div>
        </div>
    );
};

export default ProgramInMypage;