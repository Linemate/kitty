'use client'
import React from 'react';
import { IconButton } from '@mui/material';
import 'styles/favorite.scss';
import 'styles/button.scss';
import { Button } from 'components/common/Button';

export type FavoriteProps = {
    isMate?: boolean;
    isLiked?:boolean;
    numberOfLike?: number;
    onclick?: Function;
}


const Favorite = (props:FavoriteProps) => {
    const handleClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (props.onclick) {
            props.onclick();
        }
    }
    return (
        <div className={`favorite_wrap ${props.isMate ? 'mate' : 'program'}`}>
            <div className='favorite_area'>
                <div className='ico_favorite'>
                    <Button type="img" classnames={`btn img heart ${props.isMate ? 'mate' : ''} ${props.isLiked ? 'filled' : ''}`} text="Heart" onclick={(e:React.MouseEvent<HTMLButtonElement>)=> handleClick(e)} />
                </div>
                {
                    props.numberOfLike &&
                    <div className='amount'>
                        {props.numberOfLike}
                    </div>
                }
            </div>
        </div>
    );
};

export default Favorite;