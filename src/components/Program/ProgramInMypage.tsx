'use client'
import React, { ReactElement, useState } from 'react';
import 'styles/program.scss';
import { programInMypageProps } from 'types/types';
import useMobile from 'hooks/useMobile';
import { Button } from 'components/common/Button';
import { t } from "utils/i18n";

export const initProgramInMypage = {
    label: '',
    paymentsStatus: '',
    reservationStatus: '',
    startDate: '',
    createdAt: '',
    updatedAt: '',
    programId: 0,
    reservationId: 0,
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
    method: ''
}

const ProgramInMypage = (props: programInMypageProps) => {
    const { label, reservation, type, children } = props;
    const { programId, reservationId, label: reservationLabel, startDate, createdAt, updatedAt, thumbnail, station, title, price, currency, cancelDetailMessage, paymentsStatus } = reservation;
    const isMobile = useMobile();
    const isPaymentActive = paymentsStatus === 'COMPLETED' || paymentsStatus === 'WAITING';
    return (
        <div className={`item ${isMobile ? 'mobile' : ''}`}>
            {cancelDetailMessage !== "" && !isPaymentActive && (
                <div className='cancel_detail_msg'>
                    The event was canceled by the host.
                </div>
            )}
            {
                type === 'payment' &&
                <div className='payment_status_area'>
                    {label && t(label)}<span className='payment_date'>{startDate}</span>
                </div>
            }
            <div className='item_area'>
                <div className='item_desc_area'>
                    <div className='img_area' style={{ backgroundImage: `url(${thumbnail})` }}>
                    </div>
                    <div className='text_area'>
                        {
                            type === 'simple' ?
                                ''
                                :
                                <div className='program_state'>
                                    <span className={`approve_status ${reservationLabel === "참여예정" ? 'waiting' : reservationLabel === "취소요청" ? 'request' : reservationLabel === "취소완료" ? 'canceled' : 'attended'}`}>{t(reservationLabel)}</span>
                                </div>
                        }
                        <div className='program_name'>
                            <div className='ellipsis'>
                                {title}
                            </div>
                        </div>
                        <div className='program_date'>
                            {startDate}
                        </div>
                        <div className='program_place'>
                            <div className='ico location gray'>{station}</div>
                        </div>
                    </div>
                </div>
                <div className='btn_wrapper'>
                    {
                        children ?
                            <div className='btn_area'>
                                {children}
                            </div>
                            : <></>
                    }
                </div>
            </div>
        </div>
    );
};

export default ProgramInMypage;