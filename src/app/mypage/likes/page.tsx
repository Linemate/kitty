'use client';
import React, { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useMobile from 'hooks/useMobile';
import Header from 'components/Header/Header';
import SimpleProgram from 'components/Program/SimpleProgram';
import { getLikedPrograms } from 'api';
import { useAuthStore } from 'utils/stores';
import { programSummaryProps } from 'types/types';
import { t } from 'utils/i18n';
import 'styles/mypage.scss';

function LikesPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isFromHeader = searchParams.get('from') === 'header';

    const isMobile = useMobile();
    const userInfo = useAuthStore((state) => state.userInfo);
    const [programs, setPrograms] = useState<programSummaryProps[]>([]);

    // 무한스크롤 관련 상태
    const [pageNum, setPageNum] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const observerTarget = useRef<HTMLDivElement>(null);
    const loadingRef = useRef<boolean>(false);

    const loadLikes = useCallback(async (page: number) => {
        if (loadingRef.current) return;
        try {
            loadingRef.current = true;
            setLoading(true);
            const res = await getLikedPrograms(page, 10, 'id,desc');
            const data = res?.data || res || {};
            const list = data.list || (Array.isArray(res) ? res : (Array.isArray(data) ? data : []));

            if (page === 0) {
                setPrograms(list);
            } else {
                setPrograms(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const newUniquePrograms = list.filter((p: any) => !existingIds.has(p.id));
                    return [...prev, ...newUniquePrograms];
                });
            }

            if (data.totalPages !== undefined && data.page !== undefined) {
                setHasMore(data.page < data.totalPages - 1);
                setPageNum(data.page);
            } else {
                setHasMore(list.length === 10);
                setPageNum(page);
            }
        } catch (err) {
            console.error('Failed to fetch liked programs:', err);
        } finally {
            loadingRef.current = false;
            setLoading(false);
            setInitialLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!userInfo?.token) {
            router.push(`/account/login?redirect=${encodeURIComponent(window.location.origin + '/mypage/likes')}`);
            return;
        }
        loadLikes(0);
    }, [userInfo, router, loadLikes]);

    // 무한스크롤 Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingRef.current && !initialLoading) {
                    loadLikes(pageNum + 1);
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) observer.observe(currentTarget);
        return () => { if (currentTarget) observer.unobserve(currentTarget); };
    }, [hasMore, pageNum, loadLikes, initialLoading]);

    return (
        <div className={`mypage likes ${isMobile ? 'mobile' : ''}`}>
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                <Header
                    title={t('찜한 목록으로')}
                    isDepth={isFromHeader ? false : !!isMobile}
                    isMobileDesc={false}
                    isLogin={!!userInfo?.token}
                />
                <div className="contents">
                    <div className="contents_inner">
                        <div className="contents_area">
                            <div className="intro">
                                <h3>Wishlist</h3>
                            </div>

                            {initialLoading ? (
                                <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--color-neutral-400)' }}>
                                    Loading...
                                </div>
                            ) : programs.length === 0 ? (
                                <div className="programs">
                                    <div className="nothing">
                                        <div className="bg">
                                            <p className="first_line">{t('찜한 모임이 없습니다.')}</p>
                                            <p>{t('마음에 드는 모임을 찜해보세요!')}</p>
                                        </div>
                                        <div style={{ marginTop: 24, textAlign: 'center' }}>
                                            <button
                                                onClick={() => router.push('/')}
                                                style={{
                                                    padding: '10px 24px',
                                                    borderRadius: 8,
                                                    border: '1px solid var(--color-neutral-500)',
                                                    background: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: 14,
                                                    color: 'var(--color-neutral-200)',
                                                }}
                                            >
                                                {t('모임 둘러보기')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(260px, 1fr))',
                                            gap: isMobile ? 12 : 24,
                                            paddingTop: 24,
                                        }}
                                    >
                                        {programs.map((program) => (
                                            <SimpleProgram key={program.id} program={program} isLiked={true} />
                                        ))}
                                    </div>

                                    {hasMore && (
                                        <div ref={observerTarget} style={{ height: '40px', marginTop: '20px' }}>
                                            {loading && <div style={{ textAlign: 'center', color: 'var(--color-neutral-400)' }}>Loading more...</div>}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LikesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LikesPageContent />
        </Suspense>
    );
}
