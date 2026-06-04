'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useMobile from 'hooks/useMobile';
import Header from 'components/Header/Header';
import SimpleProgram from 'components/Program/SimpleProgram';
import { getLikedPrograms } from 'api';
import { useAuthStore } from 'utils/stores';
import { programSummaryProps } from 'types/types';
import { t } from 'utils/i18n';
import 'styles/mypage.scss';

export default function LikesPage() {
    const router = useRouter();
    const isMobile = useMobile();
    const userInfo = useAuthStore((state) => state.userInfo);
    const [programs, setPrograms] = useState<programSummaryProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userInfo?.token) {
            router.push(`/account/login?redirect=${encodeURIComponent(window.location.origin + '/mypage/likes')}`);
            return;
        }
        const fetchLikes = async () => {
            try {
                const res = await getLikedPrograms();
                const list = res?.data ?? res ?? [];
                setPrograms(Array.isArray(list) ? list : []);
            } catch (err) {
                console.error('Failed to fetch liked programs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLikes();
    }, [userInfo, router]);

    return (
        <div className={`mypage ${isMobile ? 'mobile' : ''}`}>
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                <Header
                    title={t('찜한 목록으로')}
                    isDepth={!!isMobile}
                    isMobileDesc={false}
                    isLogin={!!userInfo?.token}
                />
                <div className="contents">
                    <div className="contents_inner">
                        <div className="contents_area">
                            <div className="intro">
                                <h3>Wishlist</h3>
                            </div>

                            {loading ? (
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
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
                                        gap: 24,
                                        paddingTop: 24,
                                    }}
                                >
                                    {programs.map((program) => (
                                        <SimpleProgram key={program.id} program={program} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
