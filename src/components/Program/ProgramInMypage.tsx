'use client'
import { Button } from '@mui/material';
import React, { ReactElement } from 'react';
import 'styles/program.scss';
import { programInMypageProps } from 'types/types';
import useMobile from 'hooks/useMobile';


const ProgramInMypage = (props:programInMypageProps) => {
    const {id, name, status, date, applyDate, type, location, children } = props;
    const isMobile = useMobile();

    return (
        <div className={`item ${isMobile ? 'mobile' : ''}`}>
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