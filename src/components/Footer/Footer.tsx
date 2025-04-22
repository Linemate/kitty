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
import useMobile from 'hooks/useMobile';

type contactProps = {
    id:number;
    name:string;
    value:string;
    link:string;
}

const Footer = () => {
    const isMobile = useMobile();
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
            name: 'LINE',
            value: 'line',
            link: ''
        },
        {
            id : 3,
            name: 'Whatsapp',
            value:'whatsapp',
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
        <div className={`footer ${isMobile ? 'mobile' : ''}`}>
            <div className='inner'>
                <div className='left'>
                    <div className='logo'>LINEMATE</div>
                    <div className='txt'>
                        <div className='top'>
                            <div className='row'>대표 : 장원준</div>
                            <div className='row'>주소 : Room B02 on the 1st floor, 12 An-gil, Sinchon-ro, Mapo-gu, Seoul</div>
                            <div className='row'>사업자등록번호 : 000-00-00000</div>
                            <div className='row'>통신판매업신고번호 : 0000-0000-00000</div>
                        </div>
                        {
                            !isMobile &&
                            <div className='bottom'>
                                <div onClick={() => viewPage('term')}>이용약관</div>
                                <div onClick={() => viewPage('privacy')}>개인정보 처리방침</div>
                            </div>
                        }
                    </div>
                </div>
                {
                    !isMobile &&
                    <div className='right'>
                        <div className='subtitle'>FOLLOW US</div>
                        <div className='col'>
                            <ul>
                                {
                                    contactList.map((el:contactProps) => <li key={el.id}>
                                        <Button type={'img'} text={el.name} classnames={`contact ${el.value}`} onclick={() => handleContact(el.link)} />
                                    </li>)
                                }
                            </ul>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Footer;