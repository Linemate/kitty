'use client';
import React, { useCallback, useEffect, useState } from 'react';
import KeyVisual from 'components/KeyVisual/KeyVisual';
import SlideWrap from 'components/SlideWrap/SlideWrap';
import { useRouter } from 'next/navigation';
import Title from 'components/Title/Title';
import Program from 'components/Program/Program';
import 'styles/home.scss';
import { TextButtonWithIcon } from 'components/common/Button';
import Footer from 'components/Footer/Footer';
import Header from 'components/Header/Header';
import { getCategories, getCollectionDetails, getCollections, refreshToken } from 'api';
import { categoryProps, collectionsProps, programSummaryProps } from 'types/types';
import SimpleProgram from 'components/Program/SimpleProgram';
import useMobile from 'hooks/useMobile';
import { clearDuplicateCookies } from 'utils/clearDuplicateCookies';
import { parseCookies } from 'nookies';
import { useAuthStore } from 'utils/stores';

const Main = () => {
    // 카테고리
    const [categories, setCategories] = useState<categoryProps[]>([]);
    const [list, setList] = useState<collectionsProps[]>([]);
    const [isLogin, setIsLogin] = useState<boolean>(false);
    // 로그인 여부
    const userInfo = useAuthStore.getState().userInfo;
    const setUserInfo = useAuthStore.getState().setUserInfo;
    const clearToken = useAuthStore.getState().clearToken;
    const isMobile = useMobile();
    const router = useRouter();
    const viewMorePage = () => {
        router.push(`/more`);
    };
    const viewCollectionPage = (collectionId: number) => {
        router.push(`/collection/${collectionId}`);
    };

    // 카테고리 조회
    const loadAllCategories = useCallback(async () => {
        try {
            const data = await getCategories();
            const list = data.data;
            setCategories(list);
        } catch (err) {
            console.log(err);
        }
    }, []);

    // 토큰 재발급
    const refreshTokenFn = useCallback(async () => {
        try {
            const cookies = parseCookies();
            const user = cookies.USERINFO;
            const userInfo = JSON.parse(user);
            if (userInfo && userInfo.id) {
                const res = await refreshToken(userInfo.id, userInfo.refreshToken);
                const data = res.data;
                setUserInfo({ ...userInfo, token: data.token, refreshToken: data.refreshToken });
                console.log(res);
            } else {
                setIsLogin(false);
            }
        } catch (err) {
            console.log('error...');
            console.log(err);
            setIsLogin(false);
            setUserInfo(null);
            clearToken();
        }
    }, [router, userInfo]);

    // 컬렉션 전체 조회
    const loadAllCollections = useCallback(async (retryCount = 0, maxRetries = 1) => {
        try {
            const data = await getCollections();
            const list = data.data;
            setList(list);
        } catch (err) {
            if (
                err &&
                typeof err === 'object' &&
                'status' in err &&
                err.status === 401 &&
                retryCount < maxRetries
            ) {
                console.log('refresh try')
                try {
                    console.log('??');
                    await refreshTokenFn();
                    // 재시도 횟수 증가
                    await loadAllCollections(retryCount + 1, maxRetries);
                } catch (refreshError) {
                    console.error('토큰 갱신 실패:', refreshError);
                }
            } else {
                console.error('프로그램 로드 실패:', err);
            }
        }
    }, []);

    useEffect(() => {
        loadAllCollections();
    }, [loadAllCollections]);

    useEffect(() => {
        loadAllCategories();
    }, [loadAllCategories]);

    return (
        <div className="home">
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                {/* Header */}
                <Header title={'라인메이트 메인'} isLogin={isLogin} />
                {/* Key visual */}
                <KeyVisual>
                    <div className="txt_area">
                        <div className="title">DON’T BE A TRAVELER, BE A LOCAL</div>
                        <p>Let’s share experience together in Linemate</p>
                        <TextButtonWithIcon classnames="right more" type="text" onclick={viewMorePage} text={'See More'} />
                    </div>
                </KeyVisual>

                {/* Contents */}
                <div className="contents">
                    {/* section 1. category */}
                    <div className="section category">
                        <div className="cate">
                            {categories.map((el: categoryProps) => (
                                <div className={`cate_item`} key={el.id} onClick={() => router.push(`/experience?cate=${el.id}`)} style={{ cursor: 'pointer' }}>
                                    <div className="img_area">
                                        <span className="img_icon" style={{ backgroundImage: `url(${el.image.image.url})` }}></span>
                                    </div>
                                    <div className="txt_area">{el.language.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* section 2. first slide wrap */}
                    {list.map((el: collectionsProps) => (
                        <div className="section slide_wrap" key={el.id}>
                            <div className="intro">
                                <div>
                                    <Title title={el.language.title} icon={'thumb'} />
                                </div>
                                <TextButtonWithIcon classnames={'all'} type={'text'} text={'ALL'} onclick={() => viewCollectionPage(el.id)} />
                            </div>
                            <div className='program_item_area'>
                                {/* 슬라이드로 넣어야 함 */}
                                {isMobile ? (
                                    <>
                                        {el.programs.map((program: programSummaryProps) => (
                                            <div key={program.id} className="program_item">
                                                <SimpleProgram program={program} />
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="slide_area">
                                        <SlideWrap autoplay={false} variableWidth={true}>
                                            {el.programs.map((program: programSummaryProps) => (
                                                <div key={program.id} className="slide">
                                                    <div className="slide_item">
                                                        <SimpleProgram program={program} />
                                                    </div>
                                                </div>
                                            ))}
                                        </SlideWrap>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default Main;
