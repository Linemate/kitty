'use client';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import SimpleProgram from 'components/Program/SimpleProgram';
import { getCategories, getPrograms } from 'api';
import { categoryProps, programSummaryProps, scheduleProps } from 'types/types';
import useMobile from 'hooks/useMobile';
import { useAuthStore } from 'utils/stores';

import 'styles/home.scss';
import 'styles/experiencePage.scss';
import ReactDatePicker from 'react-datepicker';
import { Button } from '@/components/common/Button';
import ModalPortal from 'components/Portal/ModalPortal';

const ExperiencePage = () => {
    const [categories, setCategories] = useState<categoryProps[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [programs, setPrograms] = useState<programSummaryProps[]>([]);
    const [pageNum, setPageNum] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [isCalendarModal, setIsCalendarModal] = useState<boolean>(false);

    // 달력 선택된 날짜
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // 신규 추가 상태
    const [sortBy, setSortBy] = useState<string>('latest'); // 기본값: 최신순
    const [isSortOpen, setIsSortOpen] = useState<boolean>(false);

    const sortOptions = [
        { key: 'latest', label: '최신순' },
        { key: 'popular', label: '인기순' },
        { key: 'deadline', label: '마감 임박순' },
        { key: 'price_high', label: '가격 높은순' },
        { key: 'price_low', label: '가격 낮은순' },
    ];

    const observerTarget = useRef<HTMLDivElement>(null);
    const isMobile = useMobile();
    const userInfo = useAuthStore.getState().userInfo;
    const isLogin = !!userInfo;

    const size = 20;
    const loadingRef = useRef<boolean>(false);

    // 카테고리 조회
    const loadCategories = useCallback(async () => {
        try {
            const data = await getCategories();
            setCategories(data.data);
        } catch (err) {
            console.error('카테고리 조회 실패:', err);
        }
    }, []);

    // 프로그램 조회 (필터 파라미터 추가)
    const loadPrograms = useCallback(async (
        page: number,
        category: string | null,
        startDate: Date | null,
        endDate: Date | null,
        sort: string,
        isReset: boolean = false
    ) => {
        if (loadingRef.current) return;

        try {
            loadingRef.current = true;
            setLoading(true);

            // rangeFilters 포맷팅: startDate:2023-12-25~2025-12-31
            let rangeFilters = undefined;
            if (startDate && endDate) {
                const startStr = startDate.toISOString().split('T')[0];
                const endStr = endDate.toISOString().split('T')[0];
                rangeFilters = `startDate:${startStr}~${endStr}`;
            }

            const res = await getPrograms(category || undefined, page, size, rangeFilters, sort);
            const data = res.data;
            const list = data.list || [];

            if (isReset) {
                setPrograms(list);
            } else {
                setPrograms(prev => [...prev, ...list]);
            }

            setHasMore(data.page < data.totalPages - 1);
            setPageNum(data.page);
        } catch (err) {
            console.error('프로그램 조회 실패:', err);
        } finally {
            loadingRef.current = false;
            setLoading(false);
            setInitialLoading(false);
        }
    }, []);

    // modal calendar
    const handleModalCalendar = () => {
        setIsCalendarModal(!isCalendarModal);
        const body = document.querySelector('body');
        if (body) {
            if (isCalendarModal) {
                body.style.overflow = 'hidden';
            } else {
                body.removeAttribute('style');
            }
        }
    };

    // 초기화 및 재검색 함수
    const resetAndLoad = (newCategory: string | null, newStartDate: Date | null, newEndDate: Date | null, newSort: string) => {
        setPageNum(0);
        setHasMore(true);
        setPrograms([]);
        loadPrograms(0, newCategory, newStartDate, newEndDate, newSort, true);
    };

    // 핸들러들
    const handleCategoryChange = (categoryId: string | null) => {
        setSelectedCategory(categoryId);
        resetAndLoad(categoryId, startDate, endDate, sortBy);
    };

    // 달력 변경
    const handleChangeCalendar = (update: [Date | null, Date | null]) => {
        const [startDate, endDate] = update;
        setStartDate(startDate);
        setEndDate(endDate);
        console.log(startDate, endDate);
    };

    // M월 D일 
    const exportKoreanDate = (date: Date) => {
        const m = date.getMonth() + 1;
        const d = date.getDate();
        return `${m}월 ${d}일`;
    }

    // 기간 설정 완료
    const handleSetPeriod = () => {
        setIsCalendarModal(false);
        resetAndLoad(selectedCategory, startDate, endDate, sortBy);
    };

    const handleSortChange = (sortType: string) => {
        setSortBy(sortType);
        setIsSortOpen(false);
        resetAndLoad(selectedCategory, startDate, endDate, sortType);
    };

    // 무한스크롤 Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
                    loadPrograms(pageNum + 1, selectedCategory, startDate, endDate, sortBy, false);
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) observer.observe(currentTarget);
        return () => { if (currentTarget) observer.unobserve(currentTarget); };
    }, [hasMore, pageNum, selectedCategory, startDate, endDate, sortBy, loadPrograms]);

    useEffect(() => {
        loadCategories();
        loadPrograms(0, null, null, null, 'latest', true);
    }, [loadCategories]);

    return (
        <div className="home experience">
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                <Header title={'Experience'} isLogin={isLogin} />

                <div className="contents">
                    <div className='page_title'>
                        <h3>Experience</h3>
                    </div>
                    {/* 카테고리 탭 */}
                    <div className="section category_tab">
                        <div className="tab_area">
                            <div className="tab bar">
                                <ul>
                                    <li className={selectedCategory === null ? 'selected' : ''} onClick={() => handleCategoryChange(null)}>All</li>
                                    {categories.map((category) => (
                                        <li
                                            key={category.id}
                                            className={selectedCategory === String(category.id) ? 'selected' : ''}
                                            onClick={() => handleCategoryChange(String(category.id))}
                                        >
                                            {category.language.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 필터 바 (날짜 & 정렬) */}
                    <div className="section filter_bar">
                        <div className="filter_container">
                            {/* 날짜 선택 버튼 */}
                            <div className="datepicker_wrapper">
                                <Button type="text" classnames={`ico border lightgray arrow`} onclick={handleModalCalendar} text="날짜" />
                                {
                                    isCalendarModal && (
                                        <div className='datepicker_area'>
                                            <div className={`modal ${isCalendarModal ? 'on' : ''}`}>
                                                <div className="header">
                                                    <div className="title">날짜 선택</div>
                                                    <button type="button" className="btn img close big" onClick={handleModalCalendar}>
                                                        닫기
                                                    </button>                         </div>
                                                <div className="calendar_wrap">
                                                    <div className="calendar_area">
                                                        <div className="calendar">  <ReactDatePicker onChange={handleChangeCalendar} startDate={startDate} endDate={endDate} selectsRange={true} inline />
                                                        </div>
                                                    </div>
                                                    {
                                                        startDate && endDate ?
                                                            <Button type="text" classnames={`border blue`} onclick={handleSetPeriod} text={`${exportKoreanDate(startDate)} ~ ${exportKoreanDate(endDate)}`} /> : '날짜를 선택해주세요'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>

                            {/* 정렬 버튼 */}
                            <div className="sort_wrapper">
                                <Button type="text" classnames={`ico border lightgray arrow`} onclick={() => setIsSortOpen(true)} text="정렬" />
                                {isSortOpen && (
                                    <ModalPortal title="정렬" type="sorting" closePortal={() => setIsSortOpen(false)}>
                                        <div className='select_wrap'>
                                            <div className="select_options">
                                                <ul>
                                                    {sortOptions.map((option) => (
                                                        <li key={option.key} onClick={() => handleSortChange(option.key)} className={`${sortBy === option.key ? 'selected' : ''}`}>
                                                            <div className="option">{option.label}</div>
                                                            {
                                                                isMobile &&
                                                                <span className={`ico radio ${sortBy === option.key ? 'checked' : 'default'}`}></span>
                                                            }
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </ModalPortal>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 프로그램 리스트 */}
                    <div className="section programs_list">
                        {initialLoading ? (
                            <div className="loading_area"><p>로딩 중...</p></div>
                        ) : programs.length > 0 ? (
                            <div className={`programs_grid ${isMobile ? 'mobile' : ''}`}>
                                {programs.map((program) => (
                                    <SimpleProgram key={program.id} program={program} />
                                ))}
                            </div>
                        ) : (
                            <div className="no_programs"><p>등록된 프로그램이 없습니다.</p></div>
                        )}

                        {hasMore && (
                            <div ref={observerTarget} className="observer_target">
                                {loading && <div className="loading_area"><p>로딩 중...</p></div>}
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default ExperiencePage;