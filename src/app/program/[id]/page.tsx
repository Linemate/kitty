'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Program from 'components/Program/Program';
import Mate from 'components/Mate/Mate';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, useRouter } from 'next/navigation';
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
import { getProgramDetails, getProgramSchedules, postProgramLike, refreshToken, requestPayments } from 'api';
import { imagesProps, popupProps, programProps, programSummaryProps, responsePaymentProps, scheduleProps } from 'types/types';
import { useAuthStore } from 'utils/stores';
import WidgetCheckout from 'components/common/WidgetCheckout';
import { parseCookies } from 'nookies';
import SimpleProgram from 'components/Program/SimpleProgram';
import Popup from 'components/Portal/Popup';
import PopupPortal, { initPopup } from 'components/Portal/PopupPortal';

const tabsData = [
    {
        id: 0,
        name: 'Introduce',
        krName: '소개',
    },
    {
        id: 1,
        name: 'Place',
        krName: '장소',
    },
    {
        id: 2,
        name: 'Review',
        krName: '후기',
    },
    {
        id: 3,
        name: 'Q&A',
        krName: 'Q&A',
    },
];

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const initProgram = {
    category: {
        id: 0,
        title: '',
        contents: '',
        country: '',
    },
    contents: '',
    htmlFilePath: '',
    currency: '',
    price: 0,
    hiddenInfo: {
        id: 0,
        programId: 0,
        address: '',
    },
    id: 0,
    images: [],
    isEnd: false,
    isLike: false,
    isParking: false,
    isReserved: false,
    likes: 0,
    mate: {
        id: 0,
        email: '',
        name: '',
        image: {
            id: 0,
            fileName: '',
            url: '',
        },
        introduce: '',
    },
    recommendPrograms: {
        id: 0,
        mateId: 0,
        title: '',
        station: '',
        thumbnailUrl: '',
        contents: '',
        price: 0,
        currency: '',
        reviewsCount: 0,
        likesCount: 0,
        reservationDate: '',
        banner: [],
    },
    reviews: 0,
    station: '',
    thumbnail: '',
    title: '',
    xcoordinate: 0,
    ycoordinate: 0,
};

const initTime = {
    id: 0,
    capacity: 0,
    startDate: '',
    endDate: '',
    reservationDate: '',
    reservationCount: 0,
};

const today = new Date();
const ProgramDetails = () => {
    const param = useParams();
    const windowSize = useResize();
    const isMobile = useMobile();
    const [loading, setLoading] = useState<boolean>(true);
    const [program, setProgram] = useState<programProps>(initProgram);
    // modal
    const [isSharePopup, setIsSharePopup] = useState<boolean>(false);
    const [isCalendarModal, setIsCalendarModal] = useState<boolean>(false);
    const [popup, setPopup] = useState<popupProps>(initPopup);
    // 탭 선택
    const [selectedTab, setSelectedTab] = useState<string>(tabsData[0].name);
    // 선택한 날짜들
    const [selectedDate, setSelectedDate] = useState<Date>();
    // 가능한 날짜들
    const [availableDates, setAvailableDates] = useState<Date[]>([]);
    const [availableTimes, setAvailableTimes] = useState<scheduleProps[]>([]);
    const [selectedTime, setSelectedTime] = useState<scheduleProps>(initTime);

    // 추천 프로그램
    const [recommendPrograms, setRecommendPrograms] = useState<programProps[]>([]);

    // 스크롤 Y값
    const [sctop, setSctop] = useState<number>(0);
    const [isFixedBottom, setIsFixedBottom] = useState<boolean>(false);
    const [htmlBody, setHtmlBody] = useState<string>('');

    const [id, setId] = useState<string>(param.id[0] || '');

    // 로그인 여부
    const userInfo = useAuthStore.getState().userInfo;
    const setUserInfo = useAuthStore.getState().setUserInfo;

    // router
    const router = useRouter();
    // 결제
    const [responsePayment, setResponsePayment] = useState<responsePaymentProps | null>(null);
    // toss 결제
    const [readyToToss, setReadyToToss] = useState<boolean>(false);
    // ref
    const btnReservationRef = useRef<HTMLDivElement>(null);

    // tab 이동
    const handleTab = (tab: string) => {
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
    };

    // 토큰 재발급
    const refreshTokenFn = async () => {
        try {
            const cookies = parseCookies();
            const user = cookies.USERINFO;
            const userInfo = JSON.parse(user);
            if (userInfo) {
                const res = await refreshToken(userInfo.id, userInfo.refreshToken);
                setUserInfo({ ...res.data });
                console.log(res);
            } else {
                alert('로그인이 필요해요.');
                router.push(`/login?redirect=${encodeURIComponent(window.location.origin + '/program/' + id)}`);
                return;
            }
        } catch(err) {
            console.log(err);
        }
    };

    // 예약하기 api 호출
    const handleReservation = useCallback(async () => {
        try {
            const cookies = parseCookies();
            const user = cookies.USERINFO;
            console.log(userInfo);
            // 비로그인
            if (!user) {
                alert('로그인이 필요해요.');
                router.push(`/login?redirect=${encodeURIComponent(window.location.origin + '/program/' + id)}`);
                return;
            }
            // 시간 미선택
            if (selectedTime.id === 0) {
                alert('시간을 선택해주세요.');
                return;
            }
            const numOfId = parseInt(id);
            const values = {
                programId: numOfId,
                scheduleId: selectedTime.id,
                amount: program.price,
            };
            const res = await requestPayments(values);
            const data = res.data;
            setResponsePayment(data);
            setReadyToToss(true);
        } catch (err) {
            console.log(err);
            if (err && typeof err === 'object' && 'status' in err && err.status === 401) {
                // await refreshTokenFn();
            } else {
                alert((err as any).response?.data?.message || '오류가 발생했습니다.');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, program.price, router, selectedTime.id]);

    const chooseTime = (time: scheduleProps) => {
        setSelectedTime(time);
        handleModalCalendar(false);
    };

    // 추천 영역
    const viewMorePage = () => {};

    // 프로그램 좋아요
    const handleLike = () => {};

    // 공유하기
    const viewSharePopup = () => {
        setIsSharePopup(true);
    };
    // 공유하기 닫기
    const closeSharePopup = () => {
        setIsSharePopup(false);
    };
    // 공유하기
    const shareProgram = (str: string) => {
        console.log(str);
    };

    // 프로그램 좋아요
    const sendLike = async () => {
        if (userInfo && userInfo.token) {
            await postProgramLike(program.id);
            loadProgramDetails();
        } else {
            setPopup({
                show: true,
                type: 'login',
                children: <div>로그인 후 이용해주세요.</div>,
                closePortal: () => {
                    setPopup(initPopup);
                    router.push(`/login?redirect=${encodeURIComponent(window.location.origin + '/program/' + id)}`);
                },
                noText: '확인',
            });
        }
    };

    // header에 들어갈 버튼들
    const btns = () => {
        return (
            <div className="btn_wrap">
                <div onClick={sendLike} className={`ico heart ${program.isLike && userInfo && userInfo.token ? 'red' : 'gray_line'}`}>
                    {program.likes}
                </div>
                <Button type={'img'} classnames={'share'} text={'공유하기'} onclick={viewSharePopup} />
            </div>
        );
    };

    // modal calendar
    const handleModalCalendar = (flag: boolean) => {
        setIsCalendarModal(flag);
        const body = document.querySelector('body');
        if (body) {
            if (flag) {
                body.style.overflow = 'hidden';
            } else {
                body.removeAttribute('style');
            }
        }
    };
    // 달력 change
    const handleChangeDate = useCallback(
        async (date: Date) => {
            try {
                setSelectedDate(date as Date);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const d = date.getDate();
                const fullD = `${year}${month < 10 ? '0' + month : month}${d < 10 ? '0' + d : d}`;
                const res = await getProgramSchedules(id, fullD);
                const data = res.data;
                setAvailableTimes(data);
                setSelectedTime(initTime);
            } catch (err) {
                console.log(err);
            }
        },
        [id]
    );
    // 월별
    const handleChangeMonth = useCallback(
        async (date: Date) => {
            try {
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const res = await getProgramSchedules(id, `${year}${month < 10 ? '0' + month : month}`);
                const data = res.data;
                const rDates = data.map((d: scheduleProps) => {
                    const date = new Date(d.reservationDate);
                    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
                    return new Date(kstDate.getUTCFullYear(), kstDate.getUTCMonth(), kstDate.getUTCDate());
                });
                setAvailableDates(rDates);
                setSelectedTime(initTime);
                handleChangeDate(date);
            } catch (err) {
                console.log(err);
            }
        },
        [handleChangeDate, id]
    );

    // 프로그램 상세
    const loadProgramDetails = useCallback(async (retryCount = 0, maxRetries = 1) => {
        try {
            console.log(id);
            const res = await getProgramDetails(id);
            const data = res.data;
            setProgram(data);
            setLoading(false);
            setRecommendPrograms(data.recommendPrograms);
            handleChangeMonth(today);
        } catch (err) {
            console.log(typeof err === 'object')
            console.log(retryCount < maxRetries)
            if (
                err &&
                typeof err === 'object' &&
                'status' in err &&
                err.status === 401 &&
                retryCount < maxRetries
              ) {
                console.log('refresh try')
                try {
                  await refreshTokenFn();
                  // 재시도 횟수 증가
                  await loadProgramDetails(retryCount + 1, maxRetries);
                } catch (refreshError) {
                  console.error('토큰 갱신 실패:', refreshError);
                  setLoading(false);
                }
              } else {
                console.error('프로그램 로드 실패:', err);
                setLoading(false);
              }
        }
    }, [handleChangeMonth, id]);

    // 토스 창 닫기
    const closeWidget = () => {
        setReadyToToss(false);
    };

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
                setIsFixedBottom(btnReservation.y + btnReservation.height < 0);
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
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [param]);

    useEffect(() => {
        loadProgramDetails();
    }, [loadProgramDetails, id]);
    useEffect(() => {
        if (program.htmlFilePath !== '') {
            fetch(program.htmlFilePath)
                .then((res) => res.text())
                .then((html) => {
                    // body 내용만 추출
                    const bodyContent = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || '';
                    setHtmlBody(bodyContent);
                })
                .catch((err) => {
                    console.log(err);
                    setHtmlBody('');
                });
        }
    }, [program]);

    return (
        <div className="program">
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                {/* Header & Key visual */}
                <Header title={'라인메이트 메인'} isDepth={false} isMobileDesc={true} btns={btns()} />
                {loading ? (
                    ''
                ) : (
                    <>
                        <div className="inner">
                            <Program program={program} isDetails={true} />
                            <div className="mate_area">
                                <Mate isSummary={true} mate={program.mate} />
                            </div>
                            <div className="schedule_area">
                                <div className="title">Schedule</div>
                                <div className="datepicker_area">
                                    {isMobile && (
                                        <div className="select_area" onClick={() => handleModalCalendar(true)}>
                                            <button className="ico select" type="button">
                                                <span className="ico calendar">{selectedDate !== undefined && `${selectedDate?.getMonth() + 1}/${selectedDate.getDate()} (${days[selectedDate.getDay()]})`}</span>
                                            </button>
                                        </div>
                                    )}
                                    <div className={`${isMobile ? 'modal' : 'in_page'} ${isCalendarModal ? 'on' : ''}`}>
                                        <div className="header">
                                            <div className="title">방문 일정</div>
                                            <button type="button" className="btn img close big" onClick={() => handleModalCalendar(false)}>
                                                닫기
                                            </button>
                                        </div>
                                        <div className="calendar_wrap">
                                            <div className="calendar_area">
                                                <div className="calendar">
                                                    <ReactDatePicker onChange={handleChangeDate} onMonthChange={handleChangeMonth} includeDates={availableDates} inline />
                                                </div>
                                                <div className="guide">
                                                    <div className="available_area">
                                                        <span className="ico available"></span>Available
                                                    </div>
                                                    <div className="soldout_area">
                                                        <span className="ico soldout"></span>Soldout
                                                    </div>
                                                    <div className="unavailable_area">
                                                        <span className="ico unavailable"></span>Unavailable
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="calendar_details">
                                                <div className="top">
                                                    <div className="notice">
                                                        <div className="desc">The specifics may vary depending on the visit schedule.</div>
                                                    </div>
                                                </div>
                                                <AvailableTimes selectedTime={selectedTime} times={availableTimes} price={program.price} currency={program.currency} onclick={chooseTime} />
                                                <div ref={btnReservationRef}>
                                                    <Button type="text" classnames="bg_blue radius_none reservation" text="Reservation" onclick={handleReservation} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {isMobile && <AvailableTimes selectedTime={selectedTime} times={availableTimes} price={program.price} currency={program.currency} onclick={chooseTime} isBox={true} />}
                            <div className="tabs_area">
                                <div className="tab bar">
                                    <ul>
                                        {tabsData.map((el: any) => (
                                            <li key={el.id} className={selectedTab === el.name ? 'selected' : ''} onClick={() => handleTab(el.name)}>
                                                <div className="tab_sort">{el.name}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="desc_of_tab">
                                    {/* introduce */}
                                    <div className="contents_introduce tab_body" dangerouslySetInnerHTML={{ __html: htmlBody }}></div>
                                    {/* place */}
                                    <div className="contents_place tab_body">
                                        <div className="title">Place</div>
                                        <div className="contents">
                                            <div className="slide_wrap">
                                                <SlideWrap arrows={!isMobile} dots={true} autoplay={false} slidesToShow={1} slidesToScroll={1} length={program.images.length} indicator={true}>
                                                    {program.images.map((el: imagesProps) => (
                                                        <div className="slide" key={el.id}>
                                                            <div className="img_area">
                                                                <img src={el.image.url} alt="program image" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </SlideWrap>
                                            </div>
                                        </div>
                                        <div className="title">Location</div>
                                        <div className="contents">
                                            {/* 지도 영역 */}
                                            <div className="map_area">
                                                <div className="map">
                                                    <Map xcoordinate={program.xcoordinate} ycoordinate={program.ycoordinate} />
                                                </div>
                                                <div className="ico location gray">{program.station}</div>
                                                <p>자세한 위치는 예약 확정 시 마이페이지에서 확인 가능해요:)</p>
                                                {
                                                    // 주차공간 여부
                                                    program.isParking ? (
                                                        <div>
                                                            <span className="parking">Parking available</span>
                                                        </div>
                                                    ) : (
                                                        ''
                                                    )
                                                }
                                            </div>
                                        </div>
                                        {/* 환불규정은 고정 */}
                                        <div className="title">Refund Regulation</div>
                                        <div className="contents">
                                            <ul className="dots">
                                                <li>참여 승인 전까지는 취소 시 전액 환불 처리 됩니다.</li>
                                                <li>참여 승인된 소셜링 취소 시, 방문 6일 전까지 결제액 전액 환불됩니다. (자정 기준)</li>
                                                <li>참여 승인된 소셜링 취소 시, 방문일 5일~2일 전까지는 결제액의 30%가 환불됩니다. (자정 기준)</li>
                                                <li>방문 1일전~방문 당일 및 노쇼인 경우에는 환불이 불가합니다.</li>
                                            </ul>
                                        </div>
                                    </div>
                                    {/* review */}
                                    <div className="contents_review tab_body">
                                        <div className="title">Review</div>
                                        <div className="contents">
                                            <Review id={id} />
                                        </div>
                                    </div>

                                    {/* Q&A */}
                                    <div className="contents_qna tab_body">
                                        <div className="title">Q&amp;A</div>
                                        <div className="contents">
                                            <Qna id={id} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recommended */}
                            {recommendPrograms.length > 0 && (
                                <div className="contents_recommend">
                                    <div className="title_wrap">
                                        <div>
                                            <Title title={'Recommended For You'} icon={'gift_heart'} description={''} />
                                        </div>
                                        <TextButtonWithIcon classnames={'all'} type={'text'} text={'ALL'} onclick={viewMorePage} />
                                    </div>
                                    {/* 슬라이드로 넣어야 함 */}
                                    {isMobile ? (
                                        <div className="four_area">
                                            {recommendPrograms.map((el: programProps) => (
                                                <div className="slide" key={el.id}>
                                                    <div className="slide_item">
                                                        <SimpleProgram program={el as unknown as programSummaryProps} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="slide_area">
                                            <SlideWrap autoplay={false} variableWidth={true}>
                                                {recommendPrograms.map((el: programProps) => (
                                                    <div className="slide" key={el.id}>
                                                        <div className="slide_item">
                                                            <SimpleProgram program={el as unknown as programSummaryProps} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </SlideWrap>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={`fixed_bottom ${isFixedBottom ? 'on' : ''} ${isMobile ? 'mobile' : ''}`}>
                            <div className="fixed_bottom_inner">
                                {!isMobile && (
                                    <div className="desc_area">
                                        <div className="img" style={{ backgroundImage: `url(${program.thumbnail})` }}></div>
                                        <div className="txt">
                                            <div className="program_name">{program.title}</div>
                                            {/* <div className='program_date'>
                                                {selectedDate ? `${selectedDate.getFullYear()}.${selectedDate.getMonth() + 1 < 10 ? '0' + selectedDate.getMonth() + 1 : selectedDate?.getMonth() + 1}.${selectedDate.getDate() < 10 ? '0' + selectedDate.getDate() : selectedDate.getDate()}(${days[selectedDate.getDay()]}) ${selectedDate.getHours() > 12 ? selectedDate.getHours() - 12 : selectedDate.getHours()}:${selectedDate.getMinutes() < 10 ? '0' + selectedDate.getMinutes() : selectedDate.getMinutes()} ${selectedDate.getHours() < 12 ? 'am' : 'pm'}` : ''} 
                                            </div> */}
                                        </div>
                                    </div>
                                )}
                                <div className="btn_area">
                                    <div className="btn_reservation_area">
                                        <Button type="text" classnames="bg_blue radius_none reservation" text="Reservation" onclick={handleReservation} />
                                    </div>
                                    <div className="btn_like_area">
                                        <div onClick={sendLike} className={`ico heart ${program.isLike && userInfo && userInfo.token ? 'red' : 'gray_line'}`}>
                                            {program.likes}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Footer */}
                        <Footer />
                    </>
                )}
            </div>

            {isSharePopup && (
                <ModalPortal title={'Share'} type={'share'} closePortal={closeSharePopup}>
                    <div>
                        <ul>
                            <li onClick={() => shareProgram('kakao')}>
                                <div className="ico kakao">Kakaotalk</div>
                            </li>
                            <li onClick={() => shareProgram('facebook')}>
                                <div className="ico facebook">Facebook</div>
                            </li>
                            <li onClick={() => shareProgram('copylink')}>
                                <div className="ico copylink">Copy Link</div>
                            </li>
                        </ul>
                    </div>
                </ModalPortal>
            )}
            {popup.show && (
                <Popup>
                    <PopupPortal type={popup.type} closePortal={popup.closePortal} noText={popup.noText ? popup.noText : '취소'} yesText={'삭제'} yesFunction={popup.yesFunction}>
                        {popup.children}
                    </PopupPortal>
                </Popup>
            )}
            {/* toss */}
            {readyToToss && responsePayment && <WidgetCheckout responsePayment={responsePayment} program={program} scheduleId={selectedTime.id} closeWidget={closeWidget} />}
        </div>
    );
};

export default ProgramDetails;
