'use client'
import React from 'react';
import { IconButton } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CallIcon from '@mui/icons-material/Call';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useRouter } from 'next/navigation';
import 'styles/footer.scss';
import { Button } from 'components/common/Button';

type contactProps = {
    id:number;
    name:string;
    value:string;
    link:string;
}

const Footer = () => {
    const contactList:contactProps[] = [
        {
            id : 0,
            name: 'SMS',
            value: 'sms',
            link: ''
        },
        {
            id : 1,
            name: 'Instagram',
            value: 'instagram',
            link: ''
        },
        {
            id : 2,
            name: 'Facebook',
            value: 'facebook',
            link: ''
        },
        {
            id : 3,
            name: 'LINE',
            value:'line',
            link: ''
        }
    ]
    const router = useRouter();
    const viewPage = (link:string) => {
        router.push(`/${link}`);
    }

    // 연락처 관련 페이지로 이동
    const handleContact = (link:string) => {
        location.href = link;
    }
    return (
        <div className='footer'>
            <div className='inner'>
                <div className='left'>
                    <div className='logo'>LINEMATE</div>
                    <div className='txt'>
                        <div className='top'>
                            <div className='ceo'>
                                <div className='tit'>CEO</div><div className='cont'>장원준</div>
                            </div>
                            <div className='address'>
                                <div className='tit'>ADDRESS</div>
                                <div className='cont'>
                                    Room B02 on the 1st floor, 12 An-gil,<br/>Sinchon-ro, Mapo-gu, Seoul
                                </div>
                            </div>
                            <div className='number'>
                                <div className='tit'>
                                    TEL
                                </div>
                                <div className='cont'>
                                0507-1357-6997
                                </div>
                            </div>
                        </div>
                        <div className='bottom'>
                            Copyright 2024 LINEMATE. All rights reverved
                        </div>
                    </div>
                </div>
                <div className='right'>
                    <div className='col'>
                        <div className='subtitle'>LINK</div>
                        <ul>
                            <li><div onClick={() => viewPage('/about')}>About US</div> </li>
                            <li><div onClick={() => viewPage('/home')}>Home</div> </li>
                            <li><div onClick={() => viewPage('/shop')}>Shop</div> </li>
                        </ul>
                    </div>
                    <div className='col'>
                        <div className='subtitle'>HELP</div>
                        <ul>
                            <li><div onClick={() => viewPage('/help/announcement')}>Announcement</div> </li>
                            <li><div onClick={() => viewPage('/help/returns')}>Returns</div> </li>
                            <li><div onClick={() => viewPage('/help/privacy')}>Privacy Polices</div> </li>
                        </ul>
                    </div>
                    <div className='col'>
                        <div className='subtitle'>Contact</div>
                        <ul>
                            {
                                contactList.map((el:contactProps) => <li key={el.id}>
                                    <Button type={'img'} text={el.name} classnames={`contact ${el.value}`} onclick={() => handleContact(el.link)} />
                                </li>)
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;