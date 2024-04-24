import React from 'react';
import StyledDetails from './StyledDetails';
import Header from 'components/Header/Header';
import Image from 'next/image';

const Details = () => {
    return (
        <StyledDetails>
            <div className='wrapper'>
                {/* Header & Key visual */}
                <Header title={'라인메이트 메인'} />
                <div className='img_intro'>
                    <Image src={''} alt={'이미지소개'} />
                    {/* 해당하는 badge map*/}
                    <div className='badge_area'>
                        <span className='badge'>OUTGOING</span>
                        <span className='badge'>BEST</span>
                        <span className='badge'>LIKE 999+</span>
                    </div>
                </div>
                <div>
                    
                </div>
            </div>
        </StyledDetails>
    );
};

export default Details;