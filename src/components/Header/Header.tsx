'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import Nav from 'components/Nav/Nav';
import { Button } from 'components/common/Button';
import { useRouter } from 'next/navigation';
import 'styles/header.scss';
import useMobile from 'hooks/useMobile';
import { headerProps } from 'types/types';
import { useAuthStore, useLanguage } from 'utils/stores';
import Menu from 'components/common/Menu';
import { getCookie } from 'utils/cookiesFunction';
import { t } from "utils/i18n";

const Header = (props: headerProps) => {
    const { title, isDepth, isMobileDesc, btns, isLogin } = props;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const isMobile = useMobile();
    const router = useRouter();
    // 홈으로
    const viewHomePage = () => {
        router.push('/');
    };
    // 햄버거 버튼
    const handleOpenMenu = () => {
        setIsOpen(true);
    };
    // 햄버거 버튼 닫기
    const handleCloseMenu = () => {
        setIsOpen(false);
    };
    // like 페이지로
    const viewLikeList = () => {
        router.push('/mypage/likes');
    };
    // 로그인 화면으로
    const viewLoginPage = () => {
        router.push('/account/login');
    };
    // 뒤로가기
    const handleBack = () => {
        router.back();
    };
    // 마이페이지로
    const viewMypage = () => {
        router.push('/mypage');
    };

    // isMobile이 null이면 SSR에서는 기본 값을 사용
    if (isMobile === null) return null;

    return (
        <div className={`header_area ${isMobile ? 'mobile' : ''} ${isMobileDesc ? 'desc' : ''}`}>
            {(isMobile && isMobileDesc) || isDepth ? (
                <div className={`header_inner depth`}>
                    <div className='header_left'>
                        <Button type={'img'} classnames={'back'} text={t("뒤로가기")} onclick={handleBack} />
                        <div className="header_title">{title}</div>
                    </div>
                    {
                        isMobileDesc &&
                        <div className='header_right'>
                            {btns}
                        </div>
                    }
                </div>
            ) : (
                <div className="header_inner">
                    <div className="header_left">
                        <h1 onClick={viewHomePage}>LINEMATE</h1>
                        <Nav />
                    </div>
                    <div className="header_right">
                        <Button type={'img'} classnames={'like'} text={t("찜한 목록으로")} onclick={viewLikeList} />
                        {isMobile ? <Button type={'img'} classnames={'menu'} text={t("메뉴")} onclick={handleOpenMenu} /> : isLogin || getCookie('USERINFO') ? <span className="logined" onClick={viewMypage}>Hi Buddy!</span> : <Button type={'img'} classnames={'login'} text={t("로그인")} onclick={viewLoginPage} />}
                        {isOpen ? <Menu closeMenu={handleCloseMenu} /> : ''}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
