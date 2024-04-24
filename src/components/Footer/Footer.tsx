import React from 'react';
import StyledFooter from './StyledFooter';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CallIcon from '@mui/icons-material/Call';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

const Footer = () => {
    return (
        <StyledFooter>
            <div className='inner'>
                <div className='left'>
                    <div className='logo'>LINEMATE</div>
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
                <div className='right'>
                    <div className='col'>
                        <div className='subtitle'>LINK</div>
                        <ul>
                            <li><Link to={'/about'}>About</Link> </li>
                            <li><Link to={'/home'}>Home</Link> </li>
                            <li><Link to={'/shop'}>Shop</Link> </li>
                        </ul>
                    </div>
                    <div className='col'>
                        <div className='subtitle'>Help</div>
                        <ul>
                            <li><Link to={'/help/payment'}>Payment Options</Link> </li>
                            <li><Link to={'/help/returns'}>Returns</Link> </li>
                            <li><Link to={'/help/privacy'}>Privacy Polices</Link> </li>
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