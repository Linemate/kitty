'use client'
import React from 'react';
import Image from 'next/image';
import Favorite from 'components/Favorite/Favorite';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import 'styles/mate.scss'
import useMobile from 'hooks/useMobile';
import { mateCompProps } from 'types/types';

const Mate = (props:mateCompProps) => {
    const { mate, isSummary } = props;
    const isMobile = useMobile();
    return (
        <>
            {/* 컨텐츠 상세일 경우 정보 / 메이트 소개 페이지에 들어갈 정보 */}
            <div className={`${isSummary ? 'summary' : 'detail'} ${isMobile ? 'mobile' : ''}`}>
                <div className='img_area'>
                    <div className='profile'>
                        {
                            mate.image.url !== '' ? 
                            <img src={mate.image.url} alt={`${mate.name}의 프로필사진`} /> :
                            <div className='profile_default'></div>
                        }
                        {
                            // !isSummary &&
                            // <Favorite isMate={true} numberOfLike={1267} size={'md'} />
                        }
                    </div>
                </div>
                <div className='desc_area'>
                    <div className='name'>
                        {mate.name}
                    </div>
                    <div className='info'>
                        {mate.introduce}
                    </div>
                </div>
                {
                    // isSummary ? '' : 
                    // <>
                    //     <div className='simple_desc'>
                    //         <ul>
                    //             <li>
                    //                 <CalendarMonthIcon />
                    //                 2024.01.24 JOIN
                    //             </li>
                    //             <li>
                    //                 <VerifiedUserIcon />
                    //                 VERIFIED
                    //             </li>
                    //             <li>
                    //                 <AutoGraphIcon />
                    //                 RISING MATE
                    //             </li>
                    //         </ul>
                    //     </div>
                    //     <div className='nums'>
                    //         <ul>
                    //             <li>
                    //                 <div className='cate'>FOLLOW</div>
                    //                 <div className='num'>910</div>
                    //             </li>
                    //             <li>
                    //                 <div className='cate'>VISIT</div>
                    //                 <div className='num'>1232</div>
                    //             </li>
                    //             <li>
                    //                 <div className='cate'>SOCIALING</div>
                    //                 <div className='num'>+100</div>
                    //             </li>
                    //             <li>
                    //                 <div className='cate'>REVIEW</div>
                    //                 <div className='num'>1121</div>
                    //             </li>
                    //         </ul>
                    //     </div>
                    // </>
                }
            </div>
        </>
    );
};

export default Mate;