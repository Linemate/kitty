import Header from 'components/Header/Header';
import React from 'react';
import KeyVisual from 'components/KeyVisual/KeyVisual';
import StyledMain from './StyledMain';
import { categoryData } from 'assets/data/data';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { IconButton } from '@mui/material';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import Service from 'components/Service/Service';
import Footer from 'components/Footer/Footer';
import SlideWrap from 'components/SlideWrap/SlideWrap';

const Main = () => {
    return (
        <StyledMain>
            <div className='wrapper'>
                {/* Header & Key visual */}
                <Header title={'라인메이트 메인'} />
                <KeyVisual />

                {/* Contents */}
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
                            <h3><TagFacesIcon />Something Exciting, Look around here</h3>
                            <p>
                                If you looking for fun, please click here.
                            </p>
                        </div>
                        <button className='btn_all' type="button">ALL</button>
                    </div>
                    {/* 슬라이드로 넣어야 함 */}
                    <div className='slide_area'>
                        <SlideWrap slidesToShow={4} autoplay={false}>
                            <div className='slide_item'>
                                <div className='img_area'></div>
                                <div className='desc_area'>
                                    <div className='txt_area'>
                                        <h4>MAKE A TRADITIONAL FOOD</h4>
                                        <p>If you looking for fun, please click here.</p>
                                    </div>
                                    <div className='favorite_area'>
                                        <div className='ico_favorite'>
                                            <IconButton>
                                                <FavoriteBorderIcon sx={{color:'#FFBABA'}} />
                                            </IconButton>
                                        </div>
                                        <div className='amount'>
                                            1267
                                        </div>
                                    </div>
                                </div>
                                <div className='bottom_area'>
                                    <div className='badge_where_area'>
                                        <div className='badge_area'>
                                            {/* map 돌리기 */}
                                            <span className='badge'>OUTGOING</span>
                                            <span className='badge'>BEST</span>
                                            <span className='badge'>LIKE 999+</span>
                                        </div>
                                        <div className='where'>Gangnam</div>
                                    </div>
                                    <div className='price_area'>
                                        <span className='unit'>
                                            KRW
                                        </span>
                                        <span className='amount'>
                                            50,000
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='slide_item'>
                                <div className='img_area'></div>
                                <div className='desc_area'>
                                    <div className='txt_area'>
                                        <h4>MAKE A TRADITIONAL FOOD</h4>
                                        <p>If you looking for fun, please click here.</p>
                                    </div>
                                    <div className='favorite_area'>
                                        <div className='ico_favorite'>
                                            <IconButton>
                                                <FavoriteBorderIcon sx={{color:'#FFBABA'}} />
                                            </IconButton>
                                        </div>
                                        <div className='amount'>
                                            1267
                                        </div>
                                    </div>
                                </div>
                                <div className='bottom_area'>
                                    <div className='badge_where_area'>
                                        <div className='badge_area'>
                                            {/* map 돌리기 */}
                                            <span className='badge'>OUTGOING</span>
                                            <span className='badge'>BEST</span>
                                            <span className='badge'>LIKE 999+</span>
                                        </div>
                                        <div className='where'>Gangnam</div>
                                    </div>
                                    <div className='price_area'>
                                        <span className='unit'>
                                            KRW
                                        </span>
                                        <span className='amount'>
                                            50,000
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='slide_item'>
                                <div className='img_area'></div>
                                <div className='desc_area'>
                                    <div className='txt_area'>
                                        <h4>MAKE A TRADITIONAL FOOD</h4>
                                        <p>If you looking for fun, please click here.</p>
                                    </div>
                                    <div className='favorite_area'>
                                        <div className='ico_favorite'>
                                            <IconButton>
                                                <FavoriteBorderIcon sx={{color:'#FFBABA'}} />
                                            </IconButton>
                                        </div>
                                        <div className='amount'>
                                            1267
                                        </div>
                                    </div>
                                </div>
                                <div className='bottom_area'>
                                    <div className='badge_where_area'>
                                        <div className='badge_area'>
                                            {/* map 돌리기 */}
                                            <span className='badge'>OUTGOING</span>
                                            <span className='badge'>BEST</span>
                                            <span className='badge'>LIKE 999+</span>
                                        </div>
                                        <div className='where'>Gangnam</div>
                                    </div>
                                    <div className='price_area'>
                                        <span className='unit'>
                                            KRW
                                        </span>
                                        <span className='amount'>
                                            50,000
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='slide_item'>
                                <div className='img_area'></div>
                                <div className='desc_area'>
                                    <div className='txt_area'>
                                        <h4>MAKE A TRADITIONAL FOOD</h4>
                                        <p>If you looking for fun, please click here.</p>
                                    </div>
                                    <div className='favorite_area'>
                                        <div className='ico_favorite'>
                                            <IconButton>
                                                <FavoriteBorderIcon sx={{color:'#FFBABA'}} />
                                            </IconButton>
                                        </div>
                                        <div className='amount'>
                                            1267
                                        </div>
                                    </div>
                                </div>
                                <div className='bottom_area'>
                                    <div className='badge_where_area'>
                                        <div className='badge_area'>
                                            {/* map 돌리기 */}
                                            <span className='badge'>OUTGOING</span>
                                            <span className='badge'>BEST</span>
                                            <span className='badge'>LIKE 999+</span>
                                        </div>
                                        <div className='where'>Gangnam</div>
                                    </div>
                                    <div className='price_area'>
                                        <span className='unit'>
                                            KRW
                                        </span>
                                        <span className='amount'>
                                            50,000
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </SlideWrap>
                    </div>
                </div>
                {/* Service */}
                <Service />
                {/* Footer */}
                <Footer />
            </div>
        </StyledMain>
    );
};

export default Main;