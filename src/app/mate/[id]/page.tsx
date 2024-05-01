'use client'
import React, { useState } from 'react';
import StyledMateDetails from './StyledMateDetails';
import Header from 'components/Header/Header';
import Image from 'next/image';
import { IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import IosShareIcon from '@mui/icons-material/IosShare';
import Mate from 'components/Mate/Mate';
import SlideWrap from 'components/SlideWrap/SlideWrap';
import Title from 'components/Title/Title';
import { useRouter } from 'next/navigation';
import Program from 'components/Program/Program';
import Review from 'components/Review/Review';

const MateDetails = () => {
    const [tempImg, setTempImg] = useState('');
    const router = useRouter();
    const viewDetails = (id:number) => {
        router.push(`/program/${id}`);
    }
    return (
        <StyledMateDetails>
            <div className='wrapper'>
                {/* Header & Key visual */}
                <Header title={'라인메이트 메인'} />
                <Mate isSummary={false} mateName={'Rabbbbbit'} introduce={'introduce my name'} />

                {/* contents */}
                <div className='contents'>
                    <div className='section slide_wrap'>
                        <div className='intro'>
                            <div>
                                <Title title={'Rabbbbitt’s Socialing'} description={'If you looking for fun, please click here.'} />
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

                    <div className='section'>
                        <Review />
                    </div>

                </div>
            </div>
        </StyledMateDetails>
    );
};

export default MateDetails;