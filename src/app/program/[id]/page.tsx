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
import { Button, TextButtonWithIcon } from 'components/common/Button';
import Qna from 'components/QnA/Qna';
import Map from 'components/Map/Map';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import Title from 'components/Title/Title';
import useMobile from 'hooks/useMobile';
import ModalPortal from 'components/Portal/ModalPortal';
import AvailableTimes from 'components/Program/AvailableTimes';

const tabsData = [
    {
        id:0,
        name: 'Introduce',
        krName: '소개',
    },
    {
        id:1,
        name: 'Place',
        krName: '장소',
    },
    {
        id:2,
        name: 'Review',
        krName: '후기',
    },
    {
        id:3,
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
    const isMobile = useMobile();
    // modal
    const [isPopup, setIsPopup] = useState<boolean>(false);
    const [isCalendarModal, setIsCaleandarModal] = useState<boolean>(false);
    // 탭 선택
    const [selectedTab, setSelectedTab] = useState<string>(tabsData[0].name);
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
        const scrollY = window.scrollY;
        const convertedTab = tab.replace('&', 'n');
        const lowerCaseOfTab = convertedTab.toLocaleLowerCase();
        setSelectedTab(tab);
        const el = document.querySelector(`.contents_${lowerCaseOfTab}`);
        const barOfTab = document.querySelector('.tab.bar');
        if (el && barOfTab) {
            const topOfEl = el.getBoundingClientRect().top;
            const willBeTop = scrollY + topOfEl;
            const hOfBarOfTab = barOfTab.getBoundingClientRect().height;
            window.scrollTo(0, willBeTop - hOfBarOfTab);
        }
    }

    // 예약하기
    const handleReservation = () => {
        
    }
    
    const chooseTime = (time:string) => {
        setSelectedTime(time);
        console.log(time)
    }
    
    // 추천 영역
    const viewMorePage= () => {
    
    }

    // 프로그램 좋아요
    const handleLike = () => {
        
    }
    
    // 공유하기
    const viewSharePopup = () => {
        setIsPopup(true);
    }
    // 공유하기 닫기
    const closeSharePopup = () => {
        setIsPopup(false);
    }
    // 공유하기
    const shareProgram = (str:string) => {
        console.log(str)
    }

    // header에 들어갈 버튼들
    const btns = () => {
        return (
            <div className='btn_wrap'>
                <Button type={'img'} classnames={'heart'} text={'좋아요'} onclick={handleLike} />
                <span className='numOfLike'>46</span>
                <Button type={'img'} classnames={'share'} text={'공유하기'} onclick={viewSharePopup} />
            </div>
        )
    }

    // modal calendar
    const handleModalCalendar = (flag:boolean) => {
        setIsCaleandarModal(flag);
        const body = document.querySelector('body');
        if (body) {
            if (flag) {
                body.style.overflow = 'hidden';
            } else {
                body.removeAttribute('style');
            }
        }
    }

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
            const barOfTab = document.querySelector('.tab.bar');
            const tabOf0 = document.querySelector('.contents_introduce');
            const tabOf1 = document.querySelector('.contents_place');
            const tabOf2 = document.querySelector('.contents_review');
            const tabOf3 = document.querySelector('.contents_qna');

            if (barOfTab && tabOf0 && tabOf1 && tabOf2 && tabOf3) {
                const hOfBarOfTab = barOfTab.getBoundingClientRect().height;
                const topOfTabOf1 = scrollY + tabOf0.getBoundingClientRect().top + tabOf0.getBoundingClientRect().height;
                const topOfTabOf2 = scrollY + tabOf1.getBoundingClientRect().top + tabOf1.getBoundingClientRect().height;
                const topOfTabOf3 = scrollY + tabOf2.getBoundingClientRect().top + tabOf2.getBoundingClientRect().height;
                // Introduce 영역
                if (scrollY < topOfTabOf1 - hOfBarOfTab) {
                    setSelectedTab(tabsData[0].name);
                } 
                // Place 영역
                else if (topOfTabOf1 - hOfBarOfTab <= scrollY && scrollY < topOfTabOf2 - hOfBarOfTab) {
                    setSelectedTab(tabsData[1].name);
                } 
                // Review 영역
                else if (topOfTabOf2 - hOfBarOfTab <= scrollY && scrollY < topOfTabOf3 - hOfBarOfTab) {
                    setSelectedTab(tabsData[2].name);
                } 
                // Q&A 영역
                else {
                    setSelectedTab(tabsData[3].name);
                }
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }

    }, []);

    return (
        <div className='program'>
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                {/* Header & Key visual */}
                <Header title={'라인메이트 메인'} lang={'ko'} isDepth={false} isMobileDesc={true} btns={btns()} />
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
                                isMobile &&
                                <div className='select_area' onClick={() => handleModalCalendar(true)}>
                                    <button className='ico select' type='button'>
                                        <span className='ico calendar'>7/25 (Fri)</span>
                                    </button>
                                </div>
                            }
                            <div className={`${isMobile ? 'modal' : 'in_page'} ${isCalendarModal ? 'on' : ''}`}>
                                <div className='header'>
                                    <div className='title'>
                                        방문 일정
                                    </div>
                                    <button type='button' className='btn img close big' onClick={() => handleModalCalendar(false)}>닫기</button>
                                </div>
                                <div className='calendar_wrap'>
                                    <div className='calendar_area'>
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
                                        </div>
                                        <AvailableTimes selectedTime={selectedTime} onclick={chooseTime} />
                                        <div ref={btnReservationRef}>
                                            <Button type="text" classnames='bg_blue radius_none reservation' text="Reservation" onclick={handleReservation} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        isMobile &&
                        <AvailableTimes selectedTime={selectedTime} onclick={chooseTime} isBox={true} />
                    }
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
                                        <SlideWrap arrows={!isMobile} dots={true} autoplay={false} slidesToShow={1} 
                                        slidesToScroll={1} length={3} indicator={true}>
                                            <div className='slide'>
                                                <div className='img_area'>1</div>
                                            </div>
                                            <div className='slide'>
                                                <div className='img_area'>2</div>
                                            </div>
                                            <div className='slide'>
                                                <div className='img_area'>3</div>
                                            </div>
                                        </SlideWrap>
                                    </div>
                                </div>
                                <div className='title'>Location</div>
                                <div className='contents'>
                                    {/* 지도 영역 */}
                                    <div className='map_area'>
                                        <div className='map'>
                                            <Map />
                                        </div>
                                        <div className='ico location gray'>Jeongdong-gil 123, City hall, 302</div>
                                        <p>
                                            자세한 위치는 예약 확정 시 마이페이지에서 확인 가능해요:) 
                                        </p>
                                        <div>
                                            {/* 주차 공간 없으면 'no' */}
                                            <span className='parking'>Parking available</span>
                                        </div>
                                    </div>
                                </div>
                                {/* 환불규정은 고정 */}
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
                                <div className='contents'>
                                    <Review reviews={reviews} />
                                </div>
                            </div>

                            {/* Q&A */}
                            <div className='contents_qna tab_body'>
                                <div className='title'>Q&amp;A</div>
                                <div className='contents'>
                                    <Qna />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommended */}
                    <div className='contents_recommend'>
                        <div className='title_wrap'>
                            <div>
                              <Title title={'Recommended For You'} icon={'gift_heart'} description={''} />
                            </div>
                            <TextButtonWithIcon classnames={'all'} type={'text'} text={'ALL'} onclick={viewMorePage} />
                        </div>
                        {/* 슬라이드로 넣어야 함 */}
                        {
                            isMobile ?
                            <div className='four_area'>
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
                            </div>
                            :
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

                        }
                    </div>
                </div>
                <div className={`fixed_bottom ${isFixedBottom ? 'on' : ''} ${isMobile ? 'mobile' : ''}`}>
                    <div className='fixed_bottom_inner'>
                        {
                            !isMobile &&
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
                        }
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
            
            {
                isPopup && 
                <ModalPortal title={'Share'} type={'share'} closePortal={closeSharePopup}>
                    <div>
                        <ul>
                            <li onClick={() => shareProgram('kakao')}><div className='ico kakao'>Kakaotalk</div></li>
                            <li onClick={() => shareProgram('facebook')}><div className='ico facebook'>Facebook</div></li>
                            <li onClick={() => shareProgram('copylink')}><div className='ico copylink'>Copy Link</div></li>
                        </ul>
                    </div>
                </ModalPortal>
            }
        </div>
    );
};

export default ProgramDetails;