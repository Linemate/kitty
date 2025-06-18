'use client'
import React, { useCallback, useEffect, useState } from 'react';
import KeyVisual from 'components/KeyVisual/KeyVisual';
import SlideWrap from 'components/SlideWrap/SlideWrap';
import { useRouter } from 'next/navigation';
import Title from 'components/Title/Title';
import Program from 'components/Program/Program';
import 'styles/home.scss'
import { TextButtonWithIcon } from 'components/common/Button';
import Footer from 'components/Footer/Footer';
import Header from 'components/Header/Header';
import { getCategories, getCollectionDetails, getCollections } from 'api';
import { categoryProps, collectionsProps, programSummaryProps } from 'types/types';
import SimpleProgram from 'components/Program/SimpleProgram';
import useMobile from 'hooks/useMobile';

const Main = () => {
    // 카테고리
    const [categories, setCategories] = useState<categoryProps[]>([]);
    const [list, setList] = useState<collectionsProps[]>([]);
    const isMobile = useMobile();
    // querystring - lang=ko 붙으면 한국어로
    const router = useRouter();
    const viewMorePage = () => {
        router.push(`/more`);
    }

    // 카테고리 조회
    const loadAllCategories = useCallback(async() => {
        try {
            const data = await getCategories();
            const list = data.data;
            setCategories(list);
        } catch(err) {
            console.log(err);
        }
    }, []);

    // 컬렉션 전체 조회
    const loadAllCollections  = useCallback(async() => {
        try {
            const data = await getCollections();
            const list = data.data;
            setList(list);
        } catch(err) {
            console.log(err);
        }
    }, []);
    
    useEffect(() => {
        loadAllCollections();
    }, [loadAllCollections]);

    useEffect(() => {
        loadAllCategories();
    }, [loadAllCategories]);
    return (
        <div className='home'>
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                {/* Header */}
                <Header title={'라인메이트 메인'} lang={'ko'} />
                {/* Key visual */}
                <KeyVisual>
                    <div className='txt_area'>
                        <div className='title'>
                        DON’T BE A TRAVELER, BE A LOCAL 
                        </div>
                        <p>
                            Let’s share experience together in Linemate
                        </p>
                        <TextButtonWithIcon classnames='right more' type='text' onclick={() => viewMorePage()} text={'See More'} />

                    </div>
                </KeyVisual>

                {/* Contents */}
                <div className='contents'>
                  {/* section 1. category */}
                  <div className='section category'>
                      <div className='cate'>
                          {
                              categories.map((el:categoryProps) => <div className={`cate_item`} key={el.id}>
                                  <div className='img_area'><span className='img_icon' style={{backgroundImage: `url(${el.image.image.url})`}}></span></div>
                                  <div className='txt_area'>
                                  {el.language.title}
                                  </div>
                              </div>)

                          }
                      </div>
                </div>
                {/* section 2. first slide wrap */}
                {
                    list.map((el:collectionsProps) => 
                        
                        <div className='section slide_wrap' key={el.id}>
                            <div className='intro'>
                                <div>
                                    <Title title={el.language.title} icon={'thumb'} />
                                </div>
                                <TextButtonWithIcon classnames={'all'} type={'text'} text={'ALL'} onclick={viewMorePage} />
                            </div>
                            {/* 슬라이드로 넣어야 함 */}
                            <div className='slide_area'>
                                <SlideWrap autoplay={false} variableWidth={true} >
                                    {
                                        el.programs.map((program:programSummaryProps) => 
                                        <div key={program.id} className='slide'>
                                            <div className='slide_item'>
                                                <SimpleProgram program={program} />
                                            </div>
                                        </div>
                                        )
                                    }
                                    <div className='slide'>
                                        <div className='slide_item'>
                                            {/* <Program programName={'MAKE A TRADITIONAL FOOD'} programInfo={'If you looking for fun, please click here.'} numberOfLike={1267} where={'GangNam'} amount={50000} id={2} /> */}
                                        </div>
                                    </div>
                                    <div className='slide'>
                                        <div className='slide_item'>
                                            {/* <Program programName={'MAKE A TRADITIONAL FOOD'} programInfo={'If you looking for fun, please click here.'} numberOfLike={1267} where={'GangNam'} amount={50000} id={3} /> */}
                                        </div>
                                    </div>
                                    <div className='slide'>
                                        <div className='slide_item'>
                                            {/* <Program programName={'MAKE A TRADITIONAL FOOD'} programInfo={'If you looking for fun, please click here.'} numberOfLike={1267} where={'GangNam'} amount={50000} id={4} /> */}
                                        </div>
                                    </div>
                                </SlideWrap>
                            </div>
                        </div>
                    )
                }
                </div>
                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default Main;