'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Program from 'components/Program/Program';
import Mate from 'components/Mate/Mate';
import ReactDatePicker from 'react-datepicker';
import { useRouter } from 'next/navigation';
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
import { getProgramSchedules, postProgramLike, requestPayments, getProgramDetailsWithToken } from 'api';
import { popupProps, programProps, programSummaryProps, responsePaymentProps, scheduleProps } from 'types/types';
import { useAuthStore } from 'utils/stores';
import WidgetCheckout from 'components/common/WidgetCheckout';
import { parseCookies } from 'nookies';
import SimpleProgram from 'components/Program/SimpleProgram';
import Popup from 'components/Portal/Popup';
import PopupPortal, { initPopup } from 'components/Portal/PopupPortal';
import DetailContent from './_DetailContent';
import { shareProgram, updateMetaTags } from '@/utils/share';
import { t } from "utils/i18n";

const tabsData = [
    {
        id: 0,
        name: 'Introduce',
        krName: t("소개"),
    },
    {
        id: 1,
        name: 'Place',
        krName: t("장소"),
    },
    {
        id: 2,
        name: 'Review',
        krName: t("후기"),
    },
    {
        id: 3,
        name: 'Q&A',
        krName: 'Q&A',
    },
];

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatReservationDate = (isoString: string) => {
    if (!isoString) return '';
    const base = new Date(isoString);
    if (isNaN(base.getTime())) return '';
    const kst = new Date(base.getTime() + 9 * 60 * 60 * 1000);
    const y = kst.getFullYear();
    const m = kst.getMonth() + 1;
    const d = kst.getDate();
    const dow = days[kst.getDay()];
    let h = kst.getHours();
    const ap = h < 12 ? 'am' : 'pm';
    h = h % 12;
    if (h === 0) h = 12;
    const min = kst.getMinutes();
    const mmStr = m < 10 ? `0${m}` : `${m}`;
    const ddStr = d < 10 ? `0${d}` : `${d}`;
    const mminStr = min < 10 ? `0${min}` : `${min}`;
    return `${y}.${mmStr}.${ddStr} (${dow}) ${h}:${mminStr}${ap}`;
};

const initProgram = {
    id: 0,
    title: '',
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
        category: '',
    },
    reviews: 0,
    station: '',
    thumbnail: '',
    xcoordinate: 0,
    ycoordinate: 0,
    amenities: '',
    requiredItems: '',
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

interface PageContentProps {
    initialProgram: programProps | null;
    programId: string;
    error?: string | null;
}

const PageContent = ({ initialProgram, programId, error }: PageContentProps) => {
    const windowSize = useResize();
    const isMobile = useMobile();
    const [program, setProgram] = useState<programProps>(initialProgram || initProgram);

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

    const [isFixedBottom, setIsFixedBottom] = useState<boolean>(false);
    const [htmlBody, setHtmlBody] = useState<string>('');

    // 로그인 여부
    const storeUserInfo = useAuthStore((state) => state.userInfo);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const userInfo = isMounted ? storeUserInfo : null;

    // router
    const router = useRouter();

    // 결제
    const [responsePayment, setResponsePayment] = useState<responsePaymentProps | null>(null);

    // 결제 준비
    const [readyToPay, setReadyToPay] = useState<boolean>(false);

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

    // 예약하기 api 호출
    const handleReservation = useCallback(async () => {
        try {
            const cookies = parseCookies();
            const user = cookies.USERINFO;

            // 비로그인
            if (!user) {
                alert(t("로그인이 필요해요."));
                router.push(`/account/login?redirect=${encodeURIComponent(window.location.origin + '/program/' + programId)}`);
                return;
            }

            // 시간 미선택
            if (selectedTime.id === 0) {
                alert(t("시간을 선택해주세요."));
                return;
            }

            let dateText = '';
            if (selectedTime.reservationDate) {
                // Ensure timezone-safe parsing by manually splitting
                const dateStrParts = selectedTime.reservationDate.split('T')[0].split('-');
                const year = dateStrParts[0];
                const month = dateStrParts[1];
                const day = dateStrParts[2];
                const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
                const dayNames = [t("일"), t("월"), t("화"), t("수"), t("목"), t("금"), t("토")];
                const dayName = dayNames[dateObj.getDay()];

                let ampm = '';
                let startFormatted = '';

                const extractTime = (t: string) => {
                    let str = t;
                    if (str.includes('T')) str = str.split('T')[1];
                    else if (str.includes(' ')) str = str.split(' ')[1];
                    return str;
                };

                if (selectedTime.startDate) {
                    const [hour, minute] = extractTime(selectedTime.startDate).split(':');
                    const h = Number(hour);
                    ampm = h >= 12 ? t("오후") : t("오전");
                    const displayHour = h > 12 ? h - 12 : (h === 0 ? 12 : h);
                    startFormatted = `${String(displayHour).padStart(2, '0')}:${minute}`;
                }

                let endFormatted = '';
                if (selectedTime.endDate) {
                    const [hour, minute] = extractTime(selectedTime.endDate).split(':');
                    const h = Number(hour);
                    // Usually if start is afternoon and end is afternoon, we just show ~05:00
                    const displayHour = h > 12 ? h - 12 : (h === 0 ? 12 : h);
                    endFormatted = `~${String(displayHour).padStart(2, '0')}:${minute}`;
                }

                dateText = `${year}.${month}.${day}(${dayName}) ${ampm} ${startFormatted}${endFormatted}`.trim();
            }

            router.push(`/program/payments/before/${programId}?scheduleId=${selectedTime.id}&dateText=${encodeURIComponent(dateText)}`);
        } catch (err) {
            console.log(err);
            alert((err as any).response?.data?.message || t("오류가 발생했습니다."));
        }
    }, [programId, program.price, router, selectedTime]);

    const chooseTime = (time: scheduleProps) => {
        setSelectedTime(time);
        handleModalCalendar(false);
    };

    const getShareDescription = useCallback(() => {
        let loc = program.station || '';
        if (loc.split(' ').length > 2) {
            loc = loc.split(' ').slice(0, 2).join(' ');
        }
        let dateStr = '';
        const targetDate = selectedDate || (availableDates.length > 0 ? availableDates[0] : null);
        if (targetDate) {
            const month = targetDate.getMonth() + 1;
            const date = targetDate.getDate();
            const dayNames = [t("일"), t("월"), t("화"), t("수"), t("목"), t("금"), t("토")];
            const day = dayNames[targetDate.getDay()];
            dateStr = `, ${month}월 ${date}일(${day})`;
        }
        return `${loc}${dateStr}`;
    }, [program, selectedDate, availableDates]);

    // 공유하기
    const viewSharePopup = () => {
        setIsSharePopup(true);
    };

    // 공유하기 닫기
    const closeSharePopup = () => {
        setIsSharePopup(false);
    };

    // 공유 완료
    const completedShare = () => {
        setPopup({
            show: true,
            children: t("링크가 복사되었습니다."),
            type: 'alert',
            closePortal: () => {
                setPopup(initPopup);
                closeSharePopup();
            },
            noText: t("확인"),
        });
    };

    // 공유 실패
    const failedShare = () => {
        setPopup({
            show: true,
            children: t("공유에 실패했습니다."),
            type: 'alert',
            closePortal: () => setPopup(initPopup),
            noText: t("확인"),
        });
    };

    // 프로그램 좋아요
    const sendLike = async () => {
        if (userInfo && userInfo.token) {
            await postProgramLike(program.id);
            setProgram(prev => ({
                ...prev,
                isLike: !prev.isLike,
                likes: prev.isLike ? prev.likes - 1 : prev.likes + 1,
            }));
        } else {
            setPopup({
                show: true,
                type: 'login',
                children: <div>{t("로그인 후 이용해주세요.")}</div>,
                closePortal: () => {
                    setPopup(initPopup);
                    router.push(`/account/login?redirect=${encodeURIComponent(window.location.origin + '/program/' + programId)}`);
                },
                noText: t("확인"),
            });
        }
    };

    // header에 들어갈 버튼들
    const btns = () => {
        return (
            <div className="btn_wrap">
                {/* 2차 배포 오픈을 위해 찜 기능 임시 숨김 */}
                <div style={{ display: 'none' }}>
                    <div onClick={sendLike} className={`ico heart ${program.isLike && userInfo && userInfo.token ? 'red' : 'gray_line'}`}>
                        {program.likes}
                    </div>
                </div>
                <Button type={'img'} classnames={'share'} text={t("공유하기")} onclick={viewSharePopup} />
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
        async (date: Date | null) => {
            if (!date) return;
            try {
                setSelectedDate(date as Date);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const d = date.getDate();
                const fullD = `${year}${month < 10 ? '0' + month : month}${d < 10 ? '0' + d : d}`;
                const res = await getProgramSchedules(programId, fullD);
                const data = res.data;
                const timeList = data.filter((el: scheduleProps) => new Date(el.reservationDate).getTime() > today.getTime());
                setAvailableTimes(timeList);
                setSelectedTime(initTime);
            } catch (err) {
                console.log(err);
            }
        },
        [programId]
    );

    // 전 달, 현재, 다음 달 날짜
    const getDatesOfMonth = (year: number, month: number) => {
        const date = new Date(year, month, 1);
        const dates = [];

        while (date.getMonth() === month) {
            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        return dates;
    };

    const getPrevCurrentNextMonthDates = (baseDate: Date) => {
        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();

        const prevYear = month === 0 ? year - 1 : year;
        const prevMonth = month === 0 ? 11 : month - 1;

        const nextYear = month === 11 ? year + 1 : year;
        const nextMonth = month === 11 ? 0 : month + 1;

        const prevDates = getDatesOfMonth(prevYear, prevMonth);
        const nextDates = getDatesOfMonth(nextYear, nextMonth);

        return [...prevDates, ...nextDates];
    };

    // 월별
    const handleChangeMonth = useCallback(
        async (date: Date) => {
            try {
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const res = await getProgramSchedules(programId, `${year}${month < 10 ? '0' + month : month}`);
                const data = res.data;
                const rDates = data.map((d: scheduleProps) => {
                    const date = new Date(d.reservationDate);
                    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
                    return new Date(kstDate.getUTCFullYear(), kstDate.getUTCMonth(), kstDate.getUTCDate());
                });

                setAvailableDates([...rDates, ...getPrevCurrentNextMonthDates(date)]);
                setSelectedTime(initTime);
                handleChangeDate(date);
            } catch (err) {
                console.log(err);
            }
        },
        [handleChangeDate, programId]
    );

    // SSR 실패 시 클라이언트에서 프로그램 상세 로드
    useEffect(() => {
        if (!initialProgram) {
            (async () => {
                try {
                    const res = await getProgramDetailsWithToken(programId);
                    setProgram(res?.data || initProgram);
                    handleChangeMonth(today);
                } catch (err) {
                    console.log(t("클라이언트 프로그램 상세 로드 실패:"), err);
                }
            })();
        }
    }, [initialProgram, programId, handleChangeMonth]);

    // 토스 창 닫기
    const closeWidget = () => {
        setReadyToPay(false);
    };

    useEffect(() => {
        if (initialProgram) {
            setProgram(initialProgram);
            // setRecommendPrograms(initialProgram.recommendPrograms ? [initialProgram.recommendPrograms] : []);
            handleChangeMonth(today);
        }
    }, [initialProgram]);

    useEffect(() => {
        // scroll
        const handleScroll = () => {
            const scrollY = window.scrollY;
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
    }, []);

    useEffect(() => {
        const path = program.htmlFilePath;
        if (!path) {
            setHtmlBody('');
            return;
        }
        let cancelled = false;
        fetch(path)
            .then((res) => res.text())
            .then((html) => {
                if (cancelled) return;
                const bodyContent = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || '';
                setHtmlBody(bodyContent);
            })
            .catch((err) => {
                if (cancelled) return;
                console.log(err);
                setHtmlBody('');
            });
        return () => {
            cancelled = true;
        };
    }, [program.htmlFilePath]);

    if (error) {
        return (
            <>
                <Header title={''} isLogin={userInfo !== null} isDepth={false} />
                <div className="error_container">
                    <p>{error}</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <div className="program">
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                {/* Header & Key visual */}
                <Header isLogin={userInfo !== null} title={''} isDepth={false} isMobileDesc={true} btns={btns()} />
                {!program || program.id === 0 ? (
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
                                            <div className="title">{t("방문 일정")}</div>
                                            <button type="button" className="btn img close big" onClick={() => handleModalCalendar(false)}>
                                                {t("닫기")}</button>
                                        </div>
                                        <div className="calendar_wrap">
                                            <div className="calendar_area">
                                                <div className="calendar">
                                                    <ReactDatePicker onChange={handleChangeDate} onMonthChange={handleChangeMonth} includeDates={availableDates} minDate={today} inline />
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
                                    <div className="contents_introduce tab_body">
                                        <DetailContent html={htmlBody} />
                                    </div>
                                    {/* place */}
                                    <div className="contents_place tab_body">
                                        <div className="title">Place</div>
                                        <div className="contents">
                                            {/* 지도 영역 */}
                                            <div className="map_area">
                                                <div className="map">
                                                    <Map xcoordinate={program.xcoordinate} ycoordinate={program.ycoordinate} isPoint={false} />
                                                </div>
                                                <div className="ico location gray">{program.station}</div>
                                                <p>{t("자세한 위치는 예약 확정 시 마이페이지에서 확인 가능해요:)")}</p>
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
                                                <li>{t("결제 후 30분 경과 전 : 전액 환불")}</li>
                                                <li>{t("참여 확정 모임의 진행일 기준 4일 전까지 : 전액 환불")}</li>
                                                <li>{t("참여 확정 모임의 진행일 기준 3일 전부터 : 환불 불가")}</li>
                                                <li>{t("모임 진행 당일에 신청한 경우 : 환불 불가")}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    {/* review */}
                                    <div className="contents_review tab_body">
                                        <div className="title">Review</div>
                                        <div className="contents">
                                            <Review id={Number(programId)} isMy={false} size={4} />
                                        </div>
                                    </div>

                                    {/* Q&A */}
                                    <div className="contents_qna tab_body">
                                        <div className="title">Q&amp;A</div>
                                        <div className="contents">
                                            <Qna id={programId} isMy={false} size={4} />
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
                                        <TextButtonWithIcon classnames={'all'} type={'text'} text={'ALL'} onclick={() => { }} />
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
                                            <div className='program_date'>
                                                {selectedTime && selectedTime.reservationDate ? formatReservationDate(selectedTime.reservationDate) : ''}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="btn_area">
                                    <div className="btn_reservation_area">
                                        <Button type="text" classnames="bg_blue radius_none reservation" text="Reservation" onclick={handleReservation} />
                                    </div>
                                    {/* 2차 배포 오픈을 위해 찜 기능 임시 숨김 */}
                                    <div className="btn_like_area" style={{ display: 'none' }}>
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
                            <li onClick={() => shareProgram('kakao', program, completedShare, failedShare, getShareDescription())}>
                                <div className="ico kakao">Kakaotalk</div>
                            </li>
                            <li onClick={() => shareProgram('facebook', program, completedShare, failedShare, getShareDescription())}>
                                <div className="ico facebook">Facebook</div>
                            </li>
                            <li onClick={() => shareProgram('copylink', program, completedShare, failedShare)}>
                                <div className="ico copylink">Copy Link</div>
                            </li>
                        </ul>
                    </div>
                </ModalPortal>
            )}
            {popup.show && (
                <Popup>
                    <PopupPortal type={popup.type} closePortal={popup.closePortal} noText={popup.noText ? popup.noText : t("취소")} yesText={t("삭제")} yesFunction={popup.yesFunction}>
                        {popup.children}
                    </PopupPortal>
                </Popup>
            )}
            {/* widget */}
            {readyToPay && responsePayment && <WidgetCheckout responsePayment={responsePayment} program={program} scheduleId={selectedTime.id} closeWidget={closeWidget} />}
        </div>
    );
};

export default PageContent;