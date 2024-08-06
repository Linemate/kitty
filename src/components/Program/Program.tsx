'use client'
import React, { useState } from 'react';
import Favorite from 'components/Favorite/Favorite';
import { IconButton } from '@mui/material';
import IosShareIcon from '@mui/icons-material/IosShare';
import 'styles/program.scss';
import { useRouter } from 'next/navigation';
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
    const sendLike = () => {
        setLiked(!liked);
    }
    const viewDetails = () => {
        if (!props.isDetails) {
            router.push(`/program/${props.id}`);
        }
    }
    return (
        <div className={`program ${props.isDetails ? 'details' : ''}`}>
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
                    <p><span  onClick={viewDetails}>{props.programInfo}</span></p>
                </div>
                {
                    props.isDetails &&
                    <div className='where_price_area'>
                        <div className='where_area'>
                            {props.where}
                        </div>
                        <div className='price_area'>
                            <span className='unit'>
                                KRW
                            </span>
                            <span className='amount'>
                                {props.amount}
                            </span>
                        </div>
                    </div>
                }
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
                {
                    props.isDetails &&
                    <div className='favorite_share_area'>
                        <div>
                            <Favorite onclick={sendLike} isLiked={liked} numberOfLike={46} />
                        </div>
                        <div>
                            <IconButton>
                                <IosShareIcon />
                            </IconButton>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Program;