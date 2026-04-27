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
import { t } from "utils/i18n";

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
                            <div className="row">CEO | Won jun Jang</div>
                            <div className="row">Business Registration Number | 596-42-00909</div>
                            <div className="row">ADDRESS | B02, B1F, 12, Sinchon-ro 2an-gil, Mapo-gu, Seoul, Korea</div>
                            <div className="row">{t("Mail-order Business Report Number | 2025-서울마포-0484")}</div>
                        </div>
                        <div className="bottom">
                            <a href="https://policy.linemate.kr/service.html#tos" target='_blank'>Terms of Service</a>
                            <a href="https://policy.linemate.kr/service.html#privacy" target='_blank'>Privacy Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
