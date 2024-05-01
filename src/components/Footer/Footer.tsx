'use client'
import React from 'react';
import StyledFooter from './StyledFooter';
import { IconButton } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CallIcon from '@mui/icons-material/Call';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useRouter } from 'next/navigation';

const Footer = () => {
    const router = useRouter();
    const viewPage = (link:string) => {
        router.push(`/${link}`);
    }
    return (
        <StyledFooter>
            <div className='inner'>
                <div className='left'>
                    <div className='logo'>LINEMATE</div>
                    <div className='txt'>
                        <div className='address'>
                            Room B02 on the 1st floor, 12 An-gil,<br/>Sinchon-ro, Mapo-gu, Seoul
                        </div>
                        <div className='number'>
                            0507-1357-6997 KOREA
                        </div>
                        <div className='ceo'>
                            대표<span className='ml10'>장원준</span>
                        </div>
                    </div>
                </div>
                <div className='right'>
                    <div className='col'>
                        <div className='subtitle'>LINK</div>
                        <ul>
                            <li><div onClick={() => viewPage('/about')}>About</div> </li>
                            <li><div onClick={() => viewPage('/home')}>Home</div> </li>
                            <li><div onClick={() => viewPage('/shop')}>Shop</div> </li>
                        </ul>
                    </div>
                    <div className='col'>
                        <div className='subtitle'>Help</div>
                        <ul>
                            <li><div onClick={() => viewPage('/help/payment')}>Payment Options</div> </li>
                            <li><div onClick={() => viewPage('/help/returns')}>Returns</div> </li>
                            <li><div onClick={() => viewPage('/help/privacy')}>Privacy Polices</div> </li>
                        </ul>
                    </div>
                    <div className='col'>
                        <div className='subtitle'>Contact</div>
                        <ul>
                            <li><IconButton><MailOutlineIcon/></IconButton></li>
                            <li><IconButton><CallIcon/></IconButton></li>
                            <li><IconButton><InstagramIcon/></IconButton></li>
                            <li><IconButton><FacebookIcon/></IconButton></li>
                        </ul>
                    </div>
                </div>
            </div>
        </StyledFooter>
    );
};

export default Footer;