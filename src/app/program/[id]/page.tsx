'use client'
import React from 'react';
import StyledProgramDetails from './StyledProgramDetails';
import Header from 'components/Header/Header';
import Program from 'components/Program/Program';
import Mate from 'components/Mate/Mate';

const ProgramDetails = () => {
    return (
        <StyledProgramDetails>
            <div className='wrapper'>
                {/* Header & Key visual */}
                <Header title={'라인메이트 메인'} />

                <Program programName={'Follow me! go to Gyeongbokgung'} programInfo={'If you looking for fun, please click here. Follow me!'} numberOfLike={1267} where={'GangNam'} amount={50000} isDetails={true} />

                <Mate isSummary={true} mateName={'Rabbbbbit'} introduce={'introduce my name'} />

            </div>
        </StyledProgramDetails>
    );
};

export default ProgramDetails;