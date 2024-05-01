'use client'
import React from 'react';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VerifiedIcon from '@mui/icons-material/Verified';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StyledService from './StyledService';
const Service = () => {
    return (
        <StyledService>
            <div className='item'>
                <EmojiEventsIcon />
                <div className='txt_area'>
                    <div className='title'>
                        High Quality
                    </div> 
                    <p>
                        Real Trip For Travelers
                    </p>
                </div>
            </div>
            <div className='item'>
                <VerifiedIcon />
                <div className='txt_area'>
                    <div className='title'>
                        Warranty Protection
                    </div> 
                    <p>
                        Every Mates are Reliable
                    </p>
                </div>
            </div>
            <div className='item'>
                <ThumbUpAltIcon />
                <div className='txt_area'>
                    <div className='title'>
                        Give Memories
                    </div> 
                    <p>
                        We Can Be Friends
                    </p>
                </div>
            </div>
            <div className='item'>
                <SupportAgentIcon />
                <div className='txt_area'>
                    <div className='title'>
                        Fast Support
                    </div> 
                    <p>
                        Dedicated Support
                    </p>
                </div>
            </div>
        </StyledService>
    );
};

export default Service;