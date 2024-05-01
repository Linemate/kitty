'use client'
import React from 'react';
import StyledProgram from './StyledProgram';
import Favorite from 'components/Favorite/Favorite';
import { IconButton } from '@mui/material';
import IosShareIcon from '@mui/icons-material/IosShare';
export type ProgramProps = {
    programName : string;
    programInfo : string;
    numberOfLike : number;
    where: string;
    amount: number;
    isDetails?: boolean;
}

const Program = (props:ProgramProps) => {
    return (
        <StyledProgram className={props.isDetails ? 'details' : ''}>
            <div className='img_area'></div>
            <div className='desc_area'>
                <div className='txt_area'>
                    <h4>{props.programName}</h4>
                    <p>{props.programInfo}</p>
                </div>
                {
                    props.isDetails ?
                    <div className='price_area'>
                        <span className='unit'>
                            KRW
                        </span>
                        <span className='amount'>
                            {props.amount}
                        </span>
                    </div>
                    :
                    <Favorite numberOfLike={props.numberOfLike} />
                }
            </div>
            <div className='bottom_area'>
                <div className='badge_where_area'>
                    <div className='badge_area'>
                        {/* map 돌리기 */}
                        <span className='badge'>OUTGOING</span>
                        <span className='badge'>BEST</span>
                        <span className='badge'>LIKE 999+</span>
                    </div>
                    {
                        !props.isDetails &&
                        <div className='where'>{props.where}</div>
                    }
                </div>
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
                {
                    props.isDetails &&
                    <div className='where_share_area'>
                        <div className='where'>{props.where}</div>
                        <div>
                            <IconButton>
                                <IosShareIcon />
                            </IconButton>
                        </div>
                    </div>
                }
            </div>
        </StyledProgram>
    );
};

export default Program;