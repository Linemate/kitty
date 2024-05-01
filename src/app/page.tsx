'use client'
import Header from 'components/Header/Header';
import React from 'react';
import KeyVisual from 'components/KeyVisual/KeyVisual';
import StyledMain from './StyledMain';
import { categoryData } from 'assets/data/data';
import Service from 'components/Service/Service';
import Footer from 'components/Footer/Footer';
import SlideWrap from 'components/SlideWrap/SlideWrap';
import { useRouter } from 'next/navigation';
import Title from 'components/Title/Title';
import Program from 'components/Program/Program';

const Main = () => {
    const router = useRouter();
    const viewDetails = (id:number) => {
        router.push(`/program/${id}`);
    }
    return (
        <StyledMain>
            <div className='wrapper'>
                {/* Header & Key visual */}
                <Header title={'라인메이트 메인'} />
                <KeyVisual />

                {/* Contents */}
                <div className='contents'>
                  {/* section 1. category */}
                  <div className='section category'>
                      <div className='cate'>
                          {
                              categoryData.map((el, i) => <div className='cate_item' key={i}>
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
                              <Title title={'Something Exciting, Look around here'} description={'If you looking for fun, please click here.'} />
                          </div>
                          <button className='btn_all' type="button">ALL</button>
                      </div>
                      {/* 슬라이드로 넣어야 함 */}
                      <div className='slide_area'>
                          <SlideWrap slidesToShow={4} autoplay={false}>
                              <div onClick={() => viewDetails(1)}>
                                  <div className='slide_item'>
                                      <Program programName={'MAKE A TRADITIONAL FOOD'} programInfo={'If you looking for fun, please click here.'} numberOfLike={1267} where={'GangNam'} amount={50000} />
                                  </div>
                              </div>
                              <div onClick={() => viewDetails(2)}>
                                  <div className='slide_item'>
                                      <Program programName={'MAKE A TRADITIONAL FOOD'} programInfo={'If you looking for fun, please click here.'} numberOfLike={1267} where={'GangNam'} amount={50000} />
                                  </div>
                              </div>
                              <div onClick={() => viewDetails(3)}>
                                  <div className='slide_item'>
                                      <Program programName={'MAKE A TRADITIONAL FOOD'} programInfo={'If you looking for fun, please click here.'} numberOfLike={1267} where={'GangNam'} amount={50000} />
                                  </div>
                              </div>
                              <div onClick={() => viewDetails(4)}>
                                  <div className='slide_item'>
                                      <Program programName={'MAKE A TRADITIONAL FOOD'} programInfo={'If you looking for fun, please click here.'} numberOfLike={1267} where={'GangNam'} amount={50000} />
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
        </StyledMain>
    );
};

export default Main;