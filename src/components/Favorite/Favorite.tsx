'use client'
import React from 'react';
import StyledFavorite from './StyledFavorite';
import { IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export type FavoriteProps = {
    isMate?: boolean;
    numberOfLike: number;
}


const Favorite = (props:FavoriteProps) => {
    return (
        <StyledFavorite className={props.isMate ? 'mate' : 'program'}>
            <div className='favorite_area'>
                <div className='ico_favorite'>
                    <IconButton>
                        <FavoriteBorderIcon sx={{color:`${props.isMate ? '#229DFF' : '#FFBABA'}`}} />
                    </IconButton>
                </div>
                <div className='amount'>
                    {props.numberOfLike}
                </div>
            </div>
        </StyledFavorite>
    );
};

export default Favorite;