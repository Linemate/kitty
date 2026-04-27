'use client';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import SimpleProgram from 'components/Program/SimpleProgram';
import { getCollectionDetails } from 'api';
import { programSummaryProps } from 'types/types';
import useMobile from 'hooks/useMobile';
import { useAuthStore } from 'utils/stores';

import 'styles/home.scss';
import 'styles/experiencePage.scss';
import { t } from "utils/i18n";

const CollectionDetailsPage = () => {
    const params = useParams();
    const id = Number(params.id);
    const router = useRouter();

    const [title, setTitle] = useState<string>('');
    const [programs, setPrograms] = useState<programSummaryProps[]>([]);
    const [pageNum, setPageNum] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);

    const observerTarget = useRef<HTMLDivElement>(null);
    const isMobile = useMobile();
    const userInfo = useAuthStore.getState().userInfo;
    const isLogin = !!userInfo;

    const size = 20;
    const loadingRef = useRef<boolean>(false);

    // 컬렉션 정보 및 프로그램 불러오기
    const loadCollection = useCallback(async (page: number, isReset: boolean = false) => {
        if (loadingRef.current || !id) return;

        try {
            loadingRef.current = true;
            setLoading(true);

            const res = await getCollectionDetails(id, page, size);
            const data = res.data || {};

            // 타이틀 설정 (첫 로드 시)
            if (isReset) {
                const collectionTitle = data.language?.title || data.title || '';
                setTitle(collectionTitle);
            }

            // 프로그램 리스트 파싱
            const list: programSummaryProps[] = Array.isArray(data) ? data : (data.list || []);

            if (isReset) {
                setPrograms(list);
            } else {
                setPrograms(prev => [...prev, ...list]);
            }

            // hasMore 판별
            let more = false;
            if (data.totalPages !== undefined) {
                more = data.page < data.totalPages - 1;
            } else {
                more = list.length === size;
            }

            setHasMore(more);

            // 페이지 번호 설정
            const returnedPage = data.page !== undefined ? data.page : page;
            setPageNum(returnedPage);

        } catch (err) {
            console.error(t("컬렉션 조회 실패:"), err);
        } finally {
            loadingRef.current = false;
            setLoading(false);
            setInitialLoading(false);
        }
    }, [id]);

    // 무한스크롤 Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
                    loadCollection(pageNum + 1, false);
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) observer.observe(currentTarget);
        return () => { if (currentTarget) observer.unobserve(currentTarget); };
    }, [hasMore, pageNum, loadCollection]);

    // 초기 로드
    useEffect(() => {
        loadCollection(0, true);
    }, [loadCollection]);

    return (
        <div className="home experience">
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                <Header title={title || 'Collection'} isLogin={isLogin} />

                <div className="contents">
                    <div className='page_title' style={{ marginBottom: '30px' }}>
                        <h3>{title || 'Collection'}</h3>
                    </div>

                    {/* 프로그램 리스트 */}
                    <div className="section programs_list">
                        {initialLoading ? (
                            <div className="loading_area"><p>{t("로딩 중...")}</p></div>
                        ) : programs.length > 0 ? (
                            <div className={`programs_grid ${isMobile ? 'mobile' : ''}`}>
                                {programs.map((program) => (
                                    <SimpleProgram key={program.id} program={program} />
                                ))}
                            </div>
                        ) : (
                            <div className="no_programs"><p>{t("등록된 프로그램이 없습니다.")}</p></div>
                        )}

                        {hasMore && (
                            <div ref={observerTarget} className="observer_target">
                                {loading && <div className="loading_area"><p>{t("리스트를 불러오는 중입니다...")}</p></div>}
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default CollectionDetailsPage;
