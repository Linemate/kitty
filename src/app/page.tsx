'use client'
import Header from 'components/Header/Header';
import React from 'react';
import KeyVisual from 'components/KeyVisual/KeyVisual';
import { categoryData } from 'assets/data/data';
import Service from 'components/Service/Service';
import Footer from 'components/Footer/Footer';
import SlideWrap from 'components/SlideWrap/SlideWrap';
import { useRouter } from 'next/navigation';
import Title from 'components/Title/Title';
import Program from 'components/Program/Program';
import 'styles/home.scss'
import { TextButtonWithIcon } from 'components/common/Button';

const Main = () => {
    // querystring - lang=ko 붙으면 한국어로
    const router = useRouter();
    const viewMorePage = () => {
        router.push(`/more`);
    }
    return (
        <div className='home'>
            <div className='wrapper'>
                {/* Header & Key visual */}
                <Header title={'Linemate'} lang={'en'} />
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
                              categoryData.map((el, i) => <div className={`cate_item ${el.value}`} key={i}>
                                  <div className='img_area'></div>
                                  <div className='txt_area'>
                                  {el.enName}
                                  </div>
                              </div>)

                          }
                      </div>
                  </div>
                  {/* section 2. first slide wrap */}
                  <div className='section slide_wrap'>
                      <div className='intro'>
                          <div>
                              <Title title={'Best Events'} icon={'thumb'} description={'If you looking for fun, please click here.'} />
                          </div>
                          <TextButtonWithIcon classnames={'all'} type={'text'} text={'ALL'} onclick={viewMorePage} />
                      </div>
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
                  {/* Service */}
                  <Service />

                </div>
                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default Main;