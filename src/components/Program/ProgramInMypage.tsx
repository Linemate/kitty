'use client'
import { Button } from '@mui/material';
import React, { ReactElement } from 'react';
import 'styles/program.scss';

export type programInMypageProps = {
    id: number;
    status: string;
    name: string;
    date: string;
    applyDate: string;
    location: string;
    type?: string;
    children?: ReactElement;
}

const ProgramInMypage = (props:programInMypageProps) => {
    const {id, name, status, date, applyDate, type, location, children } = props;
    console.log('program')

    return (
        <div className='item'>
            <div className='item_desc_area'>
                <div className='img_area'>
                </div>
                <div className='text_area'>
                    {
                        type === 'simple' ?
                        ''
                        :
                        <div className='program_state'>
                            <span className={`approve_status ${status}`}>{status}</span>
                            <span className='date'>{applyDate} apply</span>
                        </div>
                    }
                    <div className='program_name'>
                        <div className='ellipsis'>
                            {name}
                        </div>
                    </div>
                    <div className='program_date'>
                        {date}
                    </div>
                    <div className='program_place'>
                        <div className='ico location gray'>{location}</div> 
                    </div>
                </div>
            </div>
            {
                children ? 
                <div className='btn_area'>
                    {children}
                </div> : <></>
            }
        </div>
    );
};

export default ProgramInMypage;