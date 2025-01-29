'use client'
import React, { useState } from 'react';
import Favorite from 'components/Favorite/Favorite';
import { IconButton } from '@mui/material';
import IosShareIcon from '@mui/icons-material/IosShare';
import 'styles/program.scss';
import { useRouter } from 'next/navigation';
import { Button } from 'components/common/Button';
export type ProgramProps = {
    programName : string;
    programInfo : string;
    numberOfLike : number;
    where: string;
    amount: number;
    isDetails?: boolean;
    id: number | string;
}

const Program = (props:ProgramProps) => {
    const router = useRouter();
    const [liked, setLiked] = useState<boolean>(false);
    const [isPopup, setIsPopup] = useState<boolean>(false);
    const sendLike = () => {
        setLiked(!liked);
    }
    const viewDetails = () => {
        if (!props.isDetails) {
            router.push(`/program/${props.id}`);
        }
    }
    // 공유하기
    const viewSharePopup = () => {
        setIsPopup(true);
    }
    // 공유하기 닫기
    const closeSharePopup = () => {
        setIsPopup(false);
    }
    return (
        <div className={`program_comp ${props.isDetails ? 'details' : ''}`}>
            <div className='img_area' onClick={viewDetails}>
                {
                    !props.isDetails && 
                    <div className='favorite_area'>
                        <Favorite onclick={sendLike} isLiked={liked} />
                    </div>
                }
            </div>
            <div className='desc_area'>
                <div className='txt_area' >
                    {
                        !props.isDetails &&
                        <div className='where'>{props.where}</div>
                    }
                    <h4><span onClick={viewDetails}>{props.programName}</span></h4>
                    <p><span onClick={viewDetails}>{props.programInfo}</span></p>
                </div>
                {
                    props.isDetails &&
                    <div className='price_area'>
                        <span className='unit'>
                            KRW
                        </span>
                        <span className='amount'>
                            {props.amount}
                        </span>
                    </div>
                }
                <div className='where_favorite_area'>
                    <div className='where_area'
                    >
                        {props.where}
                    </div>
                    <div className='favorite_share_area'>
                        <div>
                            <Favorite onclick={sendLike} isLiked={liked} numberOfLike={46} />
                        </div>
                        <div>
                            <Button type='img' classnames='border share' onclick={viewSharePopup} text='공유하기' />
                        </div>
                    </div>
                </div>
            </div>
            <div className='bottom_area'>
                {
                    !props.isDetails &&
                    <div className='price_area'>
                        <span className='unit'>
                            KRW
                        </span>
                        <span className='amount'>
                            {props.amount}
                        </span>
                    </div>
                }
                <div className='badge_where_area'>
                    <div className='badge_area'>
                        {/* map 돌리기 */}
                        <span className='badge outgoing'>OUTGOING</span>
                        <span className='badge best'>BEST</span>
                        <span className='badge like'>LIKE 999+</span>
                    </div>
                </div>
            </div>
            {
                isPopup && 
                <div className='popup'>
                    <div className='bg'></div>
                    <div className='popup_contents'>
                        dskdfljskdfljsdkfl
                    </div>
                </div>
            }
        </div>
    );
};

export default Program;