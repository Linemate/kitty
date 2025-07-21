'use client'
import React, { ReactElement } from 'react';
import 'styles/program.scss';
import { programInMypageProps } from 'types/types';
import useMobile from 'hooks/useMobile';
import { Button } from 'components/common/Button';


const ProgramInMypage = (props:programInMypageProps) => {
    const {id, name, status, date, applyDate, type, location, children } = props;
    const isMobile = useMobile();

    const checkLocation = (id:string) => {
        console.log('checkLocation');
    }

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
                            <span className={`approve_status ${status}`}>{status === 'request' ? 'Cancel Request' : status}</span>
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
            <div className='btn_wrapper'>
                <Button type='text' classnames={`blue right_arrow`} onclick={() => checkLocation('1')} text='Check Location' />
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