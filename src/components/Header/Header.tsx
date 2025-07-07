'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import Nav from 'components/Nav/Nav';
import { Button } from 'components/common/Button';
import { useRouter } from 'next/navigation';
import 'styles/header.scss';
import useMobile from 'hooks/useMobile';
import { headerProps } from 'types/types';
import { getCookie, useAuthStore, useLanguage } from 'utils/stores';
import Menu from 'components/common/Menu';

const Header = (props: headerProps) => {
    const { title, isDepth, isMobileDesc, btns } = props;
    const [openLanguage, setOpenLanguage] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const isMobile = useMobile();
    const router = useRouter();
    const language = useLanguage((state) => state.language);
    const setLanguage = useLanguage((state) => state.setLanguage);
    const isLogin = useAuthStore.getState().token;
    const changeLang = (lang: string) => {
        console.log('dddd');
    };
    // 홈으로
    const viewHomePage = () => {
        router.push('/');
    };
    // 햄버거 버튼
    const viewMenu = () => {};
    // like 페이지로
    const viewLikeList = () => {
        router.push('/like/list');
    };
    // 로그인 화면으로
    const viewLoginPage = () => {
        router.push('/login');
    };
    // 뒤로가기
    const handleBack = () => {
        router.back();
    };

    // isMobile이 null이면 SSR에서는 기본 값을 사용
    if (isMobile === null) return null;

    return (
        <div className={`header ${isMobile ? 'mobile' : ''} ${isMobileDesc ? 'desc' : ''}`}>
            {(isMobile && isMobileDesc) || isDepth ? (
                <div className={`header_inner depth`}>
                    <Button type={'img'} classnames={'back'} text={'뒤로가기'} onclick={handleBack} />
                    {isMobileDesc ? btns : <div className="header_title">{title}</div>}
                    {isMobile ? <Menu closeMenu={() => {}} lang={language} changeLang={changeLang} openLanguage={openLanguage} setOpenLanguage={setOpenLanguage} /> : ''}
                </div>
            ) : (
                <div className="header_inner">
                    <div className="header_left">
                        <h1 onClick={viewHomePage}>LINEMATE</h1>
                        <Nav />
                    </div>
                    <div className="header_right">
                        <Button type={'img text left'} classnames={`language`} text={language === 'kr' ? 'KR' : 'EN'} onclick={() => setOpenLanguage(!openLanguage)} />
                        <Button type={'img'} classnames={'like'} text={'찜한 목록으로'} onclick={viewLikeList} />
                        {isMobile ? <Button type={'img'} classnames={'menu'} text={'메뉴'} onclick={viewMenu} /> : isLogin || getCookie('LOGINTOKEN') ? <span className="logined">Hi Buddy!</span> : <Button type={'img'} classnames={'login'} text={'로그인'} onclick={viewLoginPage} />}
                        {openLanguage ? (
                            <>
                                <div className="options">
                                    <div onClick={() => changeLang('EN')}>EN</div>
                                    <div onClick={() => changeLang('KR')}>KR</div>
                                </div>
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
