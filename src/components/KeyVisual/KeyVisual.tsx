'use client'
import React from 'react';
import StyledKeyVisual from './StyledKeyVisual';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button } from '@mui/material';

export type KeyVisualProps = {
    onlyBg?: boolean;
    src?: string;
}

const KeyVisual = (props:KeyVisualProps) => {
    return (
        <StyledKeyVisual>
            {
                props.onlyBg ? 
                <img src={props.src} alt='key visual' /> : <div className='bg'>
                    <Button variant="outlined" endIcon={<ArrowForwardIcon />}>
                    More
                    </Button>
                </div>
            }
        </StyledKeyVisual>
    );
};

export default KeyVisual;