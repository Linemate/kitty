'use client'
import React, { useState } from 'react';
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
import 'styles/mate';

const MateDetails = () => {
    const [tempImg, setTempImg] = useState('');
    const router = useRouter();
    const viewDetails = (id:number) => {
        router.push(`/program/${id}`);
    }
    return (
        <>
            <div className='wrapper'>
                {/* Header & Key visual */}
                <Header title={'라인메이트 메인'} lang={'ko'} />
                <Mate isSummary={false} mateName={'Rabbbbbit'} introduce={"Let’s share experience together in Linemate Let’s share experience together in LinemateLet’s share experience together in LinemateLet’inemateLet"} />

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
                            
                        </div>
                    </div>

                    <div className='section'>
                        <Review />
                    </div>

                </div>
            </div>
        </>
    );
};

export default MateDetails;