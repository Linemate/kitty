'use client';
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
    id: number;
    name: string;
    value: string;
    link: string;
};

const Footer = () => {
    const isMobile = useMobile();
    const contactList: contactProps[] = [
        {
            id: 0,
            name: 'SMS',
            value: 'sms',
            link: '',
        },
        {
            id: 1,
            name: 'Instagram',
            value: 'instagram',
            link: '',
        },
        {
            id: 2,
            name: 'LINE',
            value: 'line',
            link: '',
        },
        {
            id: 3,
            name: 'Whatsapp',
            value: 'whatsapp',
            link: '',
        },
    ];

    // 연락처 관련 페이지로 이동
    const handleContact = (link: string) => {
        location.href = link;
    };
    return (
        <div className={`footer ${isMobile ? 'mobile' : ''}`}>
            <div className="inner">
                <div className="left">
                    <div className="logo">LINEMATE</div>
                    <div className="txt">
                        <div className="top">
                            <div className="row">상호명 : 라인메이트</div>
                            <div className="row">대표자명 : 장원준</div>
                            <div className="row">사업자등록번호 : 596-42-00909</div>
                            <div className="row">사업장 주소 : 서울특별시 마포구 신촌로2안길 12 건물내부 지하1층</div>
                            <div className='row'>유선번호 : 0507-1357-6997</div>
                            <div className="row">통신판매업신고번호 : 2025-서울마포-0484</div>
                        </div>
                        <div className="bottom">
                            <a href="https://policy.linemate.kr/service.html#tos" target='_blank'>이용약관</a>
                            <a href="https://policy.linemate.kr/service.html#privacy" target='_blank'>개인정보 처리방침</a>
                        </div>
                    </div>
                </div>
                {!isMobile && (
                    <div className="right">
                        <div className="subtitle">FOLLOW US</div>
                        <div className="col">
                            <ul>
                                {contactList.map((el: contactProps) => (
                                    <li key={el.id}>
                                        <Button type={'img'} text={el.name} classnames={`contact ${el.value}`} onclick={() => handleContact(el.link)} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Footer;
