'use client';
import React from 'react';
import { IconButton } from '@mui/material';
import 'styles/favorite.scss';
import 'styles/button.scss';
import { Button } from 'components/common/Button';
import { favoriteProps } from 'types/types';

const Favorite = (props: favoriteProps) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (props.onclick) {
            props.onclick();
        }
    };
    return (
        <div className={`favorite_wrap ${props.size} ${props.isMate ? 'mate' : 'program'}`}>
            <div className="favorite_area">
                <div className="ico_favorite">
                    <Button type="img" classnames={`heart ${props.isFilledHeart || props.isLiked ? 'filled' : ''} ${props.isMate ? 'mate' : ''}`} text="Heart" onclick={(e: React.MouseEvent<HTMLButtonElement>) => handleClick(e)} />
                </div>
                {typeof props.numberOfLike === 'number' && <div className="amount">{props.numberOfLike.toLocaleString()}</div>}
            </div>
        </div>
    );
};

export default Favorite;
