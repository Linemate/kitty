'use client'
import React, { useEffect, useRef, useState } from 'react';
import Program from 'components/Program/Program';
import Mate from 'components/Mate/Mate';
import ReactDatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'next/navigation';
import 'styles/programPage.scss';
import Review from 'components/Review/Review';
import SlideWrap from 'components/SlideWrap/SlideWrap';
import useResize from 'hooks/useResize';
import { Button } from 'components/common/Button';
import Qna from 'components/QnA/Qna';
import Map from 'components/Map/Map';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';

const tabsData = [
    {
        id:0,
        name: 'Introduce',
        krName: '소개',
    },
    {
        id:1,
        name: 'Guide',
        krName: '가이드',
    },
    {
        id:2,
        name: 'Place',
        krName: '장소',
    },
    {
        id:3,
        name: 'Review',
        krName: '후기',
    },
    {
        id:4,
        name: 'Q&A',
        krName: 'Q&A',
    },
]

const reviews = [{
    id:0,
    program: 'Make a traditional food',
    username: 'travelholic21',
    date: '2024. 02. 21',
    star: 5,
    contents: 'Lorem ipsum dolor sit amet, '
}, {
    id:1,
    program: 'Make a traditional food',
    username: 'travelholic21',
    date: '2024. 02. 21',
    star: 4,
    contents: 'Lorem ipsum dolor sit amet, '
}, {
    id:2,
    program: 'Make a traditional food',
    username: 'travelholic21',
    date: '2024. 02. 21',
    star: 3,
    contents: 'Lorem ipsum dolor sit amet, '
}, {
    id:3, 
    program: 'Make a traditional food',
    username: 'travelholic21',
    date: '2024. 02. 21',
    star: 2,
    contents: 'Lorem ipsum dolor sit amet, '
}, {
    id:4,
    program: 'Make a traditional food',
    username: 'travelholic21',
    date: '2024. 02. 21',
    star: 1,
    contents: 'Lorem ipsum dolor sit amet, '
}, {
    id:5,
    program: 'Make a traditional food',
    username: 'travelholic21',
    date: '2024. 02. 21',
    star: 0,
    contents: 'Lorem ipsum dolor sit amet, '
}];

const ProgramDetails = () => {
    const param = useParams();
    const windowSize = useResize();
    const [isCalendarModal, setIsCaleandarModal] = useState<boolean>(false);
    // Place 인덱스
    const [idxOfPlace, setIdxOfPlace] = useState<number>(0);
    // 탭 선택
    const [selectedTab, setSelectedTab] = useState<string>('Introduce');
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedTime, setSelectedTime] = useState<any>('');
    // 스크롤 Y값
    const [sctop, setSctop] = useState<number>(0);
    const [isFixedBottom, setIsFixedBottom] = useState<boolean>(false);
    const [id, setId] = useState<string>('');

    // ref
    const btnReservationRef = useRef<HTMLDivElement>(null);

    // tab 이동
    const handleTab = (tab:string) => {
        setSelectedTab(tab);
    }

    // 예약하기
    const handleReservation = () => {
        
    }
    
    const chooseTime = (time:string) => {
        setSelectedTime(time);
        console.log(time)
    }

    useEffect(() => {
        if (windowSize.width && windowSize.width <= 768) {
            console.log(windowSize.width);
            setIsCaleandarModal(true);
        }
    }, []);

    useEffect(() => {
        if (param && param.id) {
            setId(param.id[0]);
        }

        // scroll
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setSctop(scrollY);
            if (btnReservationRef.current) {
                const btnReservation = btnReservationRef.current.getBoundingClientRect();
                setIsFixedBottom(btnReservation.y + btnReservation.height < 0)
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }

    }, []);

    return (
        <div className='program'>
            <div className='wrapper'>
                {/* Header & Key visual */}
                <Header title={'라인메이트 메인'} lang={'ko'} />
                {/* Key visual */}
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
                            {
                                windowSize.width && windowSize.width <= 768 &&
                                <div className='select_area'>
                                    <button className='ico select' type='button'>
                                        <span className='ico calendar'>7/25 (Fri)</span>
                                    </button>
                                </div>
                            }
                            <div className={`calendar_area ${isCalendarModal ? 'modal' : ''}`}>
                                <div className='header'>
                                    <div className='title'>
                                        방문 일정
                                    </div>
                                    <button type='button' className='btn img close'>닫기</button>
                                </div>
                                <div className='calendar'>
                                    <ReactDatePicker onChange={(date) => setSelectedDate(date as Date)} inline />
                                </div>
                                <div className='guide'>
                                    <div className='available_area'><span className='ico available'></span>Available</div>
                                    <div className='soldout_area'><span className='ico soldout'></span>Soldout</div>
                                    <div className='unavailable_area'><span className='ico unavailable'></span>Unavailable</div>
                                </div>
                            </div>
                            <div className='calendar_details'>
                                <div className='top'>
                                    <div className='notice'>
                                        <div className='desc'>
                                        The specifics may vary depending on the visit schedule. 
                                        </div>
                                    </div>
                                    <div className='choose_time'>
                                        <div className={`available btn_time ${selectedTime === '1300' ? 'selected' : ''}`} onClick={() => chooseTime('1300')}>
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
                                        <div className={`available btn_time ${selectedTime === '1600' ? 'selected' : ''}`} onClick={() => chooseTime('1600')}>
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
                                        <div className={`soldout btn_time`} onClick={() => chooseTime('1900')}>
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

                                <div ref={btnReservationRef}>
                                    <Button type="text" classnames='bg_blue radius_none reservation' text="Reservation" onclick={handleReservation} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='tabs_area'>
                        <div className='tab bar'>
                            <ul>
                                {
                                    tabsData.map((el:any) => <li key={el.id} className={selectedTab === el.name ? 'selected' : ''} onClick={() => handleTab(el.name)}><div className='tab_sort'>{el.name}</div></li>)
                                }
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
                                <div className='contents'>
                                    <div className='slide_wrap'>
                                        <SlideWrap arrows={true} dots={true} autoplay={false} variableWidth={true} >
                                            <div className=''>
                                                <div className='img_area'>1</div>
                                            </div>
                                            <div>
                                                <div className='img_area'>2</div>
                                            </div>
                                            <div>
                                                <div className='img_area'>3</div>
                                            </div>
                                        </SlideWrap>
                                    </div>
                                </div>
                            </div>

                            {/* location */}
                            <div className='contents_location tab_body'>
                                <div className='title'>Location</div>
                                <div className='contents'>
                                    {/* 지도 영역 */}
                                    <Map />
                                    <div className='location'>Jeongdong-gil 123, City hall, 302</div>
                                    <div>
                                        {/* 주차 공간 없으면 'no' */}
                                        <span className='parking'>Parking available</span>
                                    </div>
                                </div>
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
                                <div className='title'>Review<span className='len'>{reviews.length}</span></div>
                                <div className='contents'>
                                    <Review reviews={reviews} />
                                </div>
                            </div>


                            {/* Q&A */}
                            <div className='contents_qna tab_body'>
                                <div className='title'>Q&amp;A</div>
                                <div className='paragragh'>문의하신 내용에 대해서 메이트가 확인 후 답변을 드립니다.</div>
                                <div className='contents'>
                                    <Qna />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommended */}
                    <div className='contents_recommend'>

                      {/* 슬라이드로 넣어야 함 */}
                      <div className='slide_area'>
                          <SlideWrap autoplay={false} variableWidth={true} >
                              <div className='slide'>
                                  <div className='slide_item'>
                                      <Program programName={'MAKE A TRADITIONAL FOOD'} programInfo={'If you looking for fun, please click here.'} numberOfLike={1267} where={'GangNam'} amount={50000} id={1} />
                                  </div>
                              </div>
                              <div className='slide'>
                                  <div className='slide_item'>
                                      <Program programName={'MAKE A TRADITIONAL FOOD'} programInfo={'If you looking for fun, please click here.'} numberOfLike={1267} where={'GangNam'} amount={50000} id={2} />
                                  </div>
                              </div>
                              <div className='slide'>
                                  <div className='slide_item'>
                                      <Program programName={'MAKE A TRADITIONAL FOOD'} programInfo={'If you looking for fun, please click here.'} numberOfLike={1267} where={'GangNam'} amount={50000} id={3} />
                                  </div>
                              </div>
                              <div className='slide'>
                                  <div className='slide_item'>
                                      <Program programName={'MAKE A TRADITIONAL FOOD'} programInfo={'If you looking for fun, please click here.'} numberOfLike={1267} where={'GangNam'} amount={50000} id={4} />
                                  </div>
                              </div>
                          </SlideWrap>
                      </div>
                    </div>
                    {/* New */}
                    <div className='contents_new'>
                        <SlideWrap autoplay={false} variableWidth={true} >
                              <div className='slide'>
                                  <div className='slide_item'>
                                      <Program programName={'MAKE A TRADITIONAL FOOD'} programInfo={'If you looking for fun, please click here.'} numberOfLike={1267} where={'GangNam'} amount={50000} id={1} />
                                  </div>
                              </div>
                              <div className='slide'>
                                  <div className='slide_item'>
                                      <Program programName={'MAKE A TRADITIONAL FOOD'} programInfo={'If you looking for fun, please click here.'} numberOfLike={1267} where={'GangNam'} amount={50000} id={2} />
                                  </div>
                              </div>
                              <div className='slide'>
                                  <div className='slide_item'>
                                      <Program programName={'MAKE A TRADITIONAL FOOD'} programInfo={'If you looking for fun, please click here.'} numberOfLike={1267} where={'GangNam'} amount={50000} id={3} />
                                  </div>
                              </div>
                              <div className='slide'>
                                  <div className='slide_item'>
                                      <Program programName={'MAKE A TRADITIONAL FOOD'} programInfo={'If you looking for fun, please click here.'} numberOfLike={1267} where={'GangNam'} amount={50000} id={4} />
                                  </div>
                              </div>
                          </SlideWrap>
                    </div>
                </div>
                <div className={`fixed_bottom ${isFixedBottom ? 'on' : ''}`}>
                    <div className='fixed_bottom_inner'>
                        <div className='desc_area'>
                            <div className='img'>
                                {/* <img/> */}
                            </div>
                            <div className='txt'>
                                <div className='program_name'>
                                    Seoul Exchange Students Meet up Party
                                </div>
                                <div className='program_date'>
                                    2024. 07. 15(Tue) 1:00 PM 
                                </div>
                            </div>
                        </div>
                        <div className='btn_area'>
                            <div className='btn_reservation_area'>
                                <Button type="text" classnames='bg_blue radius_none reservation' text="Reservation" onclick={handleReservation} />
                            </div>
                            <div className='btn_like_area'>
                                <div className='ico heart gray_line'>3200</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default ProgramDetails;