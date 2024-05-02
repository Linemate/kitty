'use client'
import React from 'react';
import StyledMate from './StyledMate';
import Image from 'next/image';
import Favorite from 'components/Favorite/Favorite';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

export type MateProps = {
    isSummary? : boolean;
    mateName : string;
    profileImage? : string;
    introduce : string;
    joinDate? : string;
    isIdentificated? : boolean;
    mateTitle? : string;
    numberOfLike? : number;
    isLiked? : boolean;
    numberOfFollow? : number;
    numberOfVisit? : number;
    numberOfSocialing? : number;
    numberOfReview? : number;
}

const Mate = (props:MateProps) => {
    return (
        <StyledMate>
            {/* 컨텐츠 상세일 경우 정보 / 메이트 소개 페이지에 들어갈 정보 */}
            <div className={`${props.isSummary ? 'summary' : 'detail'}`}>
                <div className='img_area'>
                    <div className='profile'>
                        {
                            props.profileImage ? <Image src={props.profileImage} alt={`${props.mateName}의 프로필사진`} /> :
                            <div className='profile_default'></div>
                        }
                        {
                            !props.isSummary &&
                            <Favorite isMate={true} numberOfLike={1267} />
                        }
                    </div>
                </div>
                <div className='desc_area'>
                    <div className='blue_text'>Linemate`s Mate</div>
                    <div className='name'>
                        {props.mateName}
                    </div>
                    <div className='info'>
                        {props.introduce}
                    </div>
                </div>
                {
                    props.isSummary ? '' : 
                    <>
                        <div className='simple_desc'>
                            <ul>
                                <li>
                                    <CalendarMonthIcon />
                                    2024.01.24 JOIN
                                </li>
                                <li>
                                    <VerifiedUserIcon />
                                    VERIFIED
                                </li>
                                <li>
                                    <AutoGraphIcon />
                                    RISING MATE
                                </li>
                            </ul>
                        </div>
                        <div className='nums'>
                            <ul>
                                <li>
                                    <div className='cate'>FOLLOW</div>
                                    <div className='num'>910</div>
                                </li>
                                <li>
                                    <div className='cate'>VISIT</div>
                                    <div className='num'>1232</div>
                                </li>
                                <li>
                                    <div className='cate'>SOCIALING</div>
                                    <div className='num'>+100</div>
                                </li>
                                <li>
                                    <div className='cate'>REVIEW</div>
                                    <div className='num'>1121</div>
                                </li>
                            </ul>
                        </div>
                    </>
                }
            </div>
        </StyledMate>
    );
};

export default Mate;