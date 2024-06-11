'use client'
import React, { useState } from 'react';
import StyledProgramDetails from './StyledProgramDetails';
import Header from 'components/Header/Header';
import Program from 'components/Program/Program';
import Mate from 'components/Mate/Mate';
import ReactDatePicker from "react-datepicker";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import PersonIcon from '@mui/icons-material/Person';
import 'react-datepicker/dist/react-datepicker.css';

const ProgramDetails = () => {
    const [selectedDate, setSelectedDate] = useState<Date>();
    return (
        <StyledProgramDetails>
            <div className='wrapper'>
                {/* Header & Key visual */}
                <Header title={'라인메이트 메인'} />

                <Program programName={'Follow me! go to Gyeongbokgung'} programInfo={'If you looking for fun, please click here. Follow me!'} numberOfLike={1267} where={'GangNam'} amount={50000} isDetails={true} />
                <div className='mate_area'>
                    <Mate isSummary={true} mateName={'Rabbbbbit'} introduce={'introduce my name'} />
                </div>
                <div className='datepicker_area'>
                    <div className=''>
                        <ReactDatePicker onChange={(date) => setSelectedDate(date as Date)} inline />
                    </div>
                    <div className=''>
                        <div className='notice'>
                            <div className='title'>NOTICE</div>
                            <div className='desc'>
                            If you looking for fun, please click here. I want to go home. 
                            </div>
                        </div>
                        <div className='choose_time'>
                            <div className='title'>CHOOSE ONE</div>
                            <div className='available selected btn_time'>
                                <div className='time_area'>
                                    <AccessAlarmIcon sx={{color:'#1496FF'}} />
                                    <strong>13:00</strong>
                                </div>
                                <div className='price_area'>
                                    <div className='price'>
                                        KRW 50,000
                                    </div>
                                    <div className='max_users'>
                                        <PersonIcon sx={{color:'#1496FF'}}  />
                                        <span className='max'>8</span>
                                    </div>
                                </div>
                            </div>
                            <div className='available btn_time'>
                                <div className='time_area'>
                                    <AccessAlarmIcon />
                                    <strong>16:00</strong>
                                </div>
                                <div className='price_area'>
                                    <div className='price'>
                                        KRW 50,000
                                    </div>
                                    <div className='max_users'>
                                        <PersonIcon />
                                        <span className='max'>8</span>
                                    </div>
                                </div>
                            </div>
                            <div className='soldout btn_time'>
                                <div className='time_area'>
                                    <AccessAlarmIcon sx={{color:'#E6E6E6'}} />
                                    <strong>19:00</strong>
                                </div>
                                <div className='price_area'>
                                    <div className='price'>
                                        KRW 50,000
                                    </div>
                                    <div className='max_users'>
                                        <PersonIcon />
                                        <span className='max'>8</span>
                                    </div>
                                    <div className='text'>
                                        SOLD OUT
                                    </div>
                                </div>
                            </div>
                            <button type="button" className='btn_reservation'>
                                RESERVATION
                            </button>
                        </div>
                    </div>
                </div>
                <div className='tab'>
                    <ul>
                        <li className='selected'>Introduce</li>
                        <li>Guide</li>
                        <li>Place</li>
                        <li>Review</li>
                    </ul>
                </div>
            </div>
        </StyledProgramDetails>
    );
};

export default ProgramDetails;