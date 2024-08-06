'use client'
import React, { useEffect, useState } from 'react';
import Header from 'components/Header/Header';
import Program from 'components/Program/Program';
import Mate from 'components/Mate/Mate';
import ReactDatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'next/navigation';
import 'styles/programPage.scss';

const ProgramDetails = () => {
    const param = useParams();
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [id, setId] = useState<string>('');

    useEffect(() => {
        if (param && param.id) {
            setId(param.id[0]);
        }
    }, []);
    return (
        <>
            <div className='wrapper'>
                {/* Header & Key visual */}
                <Header title={'라인메이트 메인'} lang={'ko'} />
                <div className='inner'>
                    <Program programName={'Follow me! go to Gyeongbokgung'} programInfo={'If you looking for fun, please click here. Follow me!'} numberOfLike={1267} where={'GangNam'} amount={50000} isDetails={true} id={id} />
                    <div className='mate_area'>
                        <Mate isSummary={true} mateName={'Rabbbbbit'} introduce={'Let’s share experience together in Linemate Let’s share experience together in LinemateLet’s share experience together in LinemateLet’inemateLet'} />
                    </div>
                    <div className='schedule_area'>
                        <div className='title'>
                            Schedule
                        </div>
                        <div className='datepicker_area'>
                            <div className=''>
                                <ReactDatePicker onChange={(date) => setSelectedDate(date as Date)} inline />
                            </div>
                            <div className=''>
                                <div className='top'>
                                    <div className='notice'>
                                        <div className='desc'>
                                        The specifics may vary depending on the visit schedule. 
                                        </div>
                                    </div>
                                    <div className='choose_time'>
                                        <div className='available selected btn_time'>
                                            <div className='time_area'>
                                                <strong>1:00 pm</strong>
                                            </div>
                                            <div className='price_area'>
                                                <div className='price'>
                                                    KRW 50,000
                                                </div>
                                            </div>
                                            <div className='ico user max_users'>
                                                10/12
                                            </div>
                                            {/* 잔여 인원이 2명일 때 자동으로 HOT */}
                                            <div className='ico hot'>
                                                Hot
                                            </div>
                                        </div>
                                        <div className='available btn_time'>
                                            <div className='time_area'>
                                                <strong>4:00 pm</strong>
                                            </div>
                                            <div className='price_area'>
                                                <div className='price'>
                                                    KRW 50,000
                                                </div>
                                            </div>
                                            <div className='ico user max_users'>
                                                1/12
                                            </div>
                                        </div>
                                        <div className='soldout btn_time'>
                                            <div className='time_area'>
                                                <strong>7:00 pm</strong>
                                            </div>
                                            <div className='price_area'>
                                                <div className='price'>
                                                    KRW 50,000
                                                </div>
                                            </div>
                                            <div className='ico user max_users'>
                                                12/12
                                            </div>
                                            {/* 잔여 인원이 0명일 때 자동으로 SOLD OUT */}
                                            <div className='ico soldout'>
                                                Soldout
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button type="button" className='btn_reservation'>
                                        Reservation
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='tabs_area'>
                        <div className='tab'>
                            <ul>
                                <li className='selected'>Introduce</li>
                                <li>Guide</li>
                                <li>Place</li>
                                <li>Review</li>
                            </ul>
                        </div>
                        <div className='desc_of_tab'>
                            {/* introduce */}
                            <div className='contents_introduce tab_body'>
                                <div className='title'>Introduce</div>
                                <div className='contents'>
                                    Let’s share experience together in Linemate Let’s share experience together in LinemateLet’s share experience together in LinemateLet’inemateLet’
                                </div>
                            </div>
                            {/* Guide */}
                            <div className='contents_guide tab_body'>
                                <div className='title'>Timeline</div>
                                <div className='contents'>
                                    <dl>
                                        <dt>20:00 - 20:15 </dt>
                                        <dd>
                                            Ice-breaking: Introduction each other
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>20:00 - 20:15 </dt>
                                        <dd>
                                            Ice-breaking: Introduction each other
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>20:00 - 20:15 </dt>
                                        <dd>
                                            Ice-breaking: Introduction each other
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>20:00 - 20:15 </dt>
                                        <dd>
                                            Ice-breaking: Introduction each other
                                        </dd>
                                    </dl>
                                </div>
                                <div className='title materials'>Materials</div>
                                <div className='contents'>
                                    Open-minded, Beverage, Camera 
                                </div>

                            </div>
                            {/* place */}
                            <div className='contents_place tab_body'>
                                <div className='title'>Place</div>
                            </div>
                            {/* Refund */}
                            <div className='contents_place tab_body'>
                                <div className='title'>Refund Regulation</div>
                                <div className='contents'>
                                    <ul className='dots'>
                                        <li>참여 승인 전까지는 취소 시 전액  환불 처리 됩니다.</li>
                                        <li>
                                        참여 승인된 소셜링 취소 시, 방문 6일 전까지 결제액 전액 환불됩니다. (자정 기준)
                                        </li>
                                        <li>
                                        참여 승인된 소셜링 취소 시, 방문일 5일~2일 전까지는 결제액의 30%가 환불됩니다. (자정 기준)
                                        </li>
                                        <li>
                                        방문 1일전~방문 당일 및 노쇼인 경우에는 환불이 불가합니다. 
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* review */}
                            <div className='contents_review tab_body'>
                                <div className='title'>Review</div>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default ProgramDetails;