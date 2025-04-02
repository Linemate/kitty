'use client'
import React, { ReactNode, useEffect, useState } from 'react';
import Nav from 'components/Nav/Nav';
import { Button } from 'components/common/Button';
import { useRouter } from 'next/navigation';
import 'styles/header.scss';
import useMobile from 'hooks/useMobile';

export type HeaderProps = {
    title?: string;
    isDepth? : boolean;
    lang:string;
    isMobileDesc?: boolean;
    btns?: ReactNode;
}

const Header = (props:HeaderProps) => {
    const { title, isDepth, lang, isMobileDesc, btns } = props;
    const isMobile = useMobile();
    const router = useRouter();
    const changeLang = () => {
        if(props.lang === 'ko') {
            router.push('/en');
        } else {
            router.push('/ko');
        }
    }
    // 홈으로
    const viewHomePage = () => {
        router.push('/');
    }
    // like 페이지로
    const viewLikeList = () => {
        router.push('/like/list');
    }
    // 로그인 화면으로
    const viewLoginPage = () => {
        router.push('/login');
    }
    // 뒤로가기
    const handleBack = () => {
        router.back();
    }
    
    
    // isMobile이 null이면 SSR에서는 기본 값을 사용
    if (isMobile === null) return null;

    return (
        <div className={`header ${isMobile ? 'mobile' : ''} ${isMobileDesc ? 'desc' : ''}`}>
            {
                (isMobile && isMobileDesc || isDepth) ? 
                <div className={`header_inner depth`}>
                    <Button type={'img'} classnames={'back'} text={'뒤로가기'} onclick={handleBack} />
                    {
                        isMobileDesc ?
                        btns
                        :
                        <div className='header_title'>
                            {title}
                        </div>
                    }
                </div>
                :
                <div className='header_inner'>
                    <div className='header_left'>
                        <h1 onClick={viewHomePage}>LINEMATE</h1>
                        <Nav />
                    </div>
                    <div className='header_right'>
                        <Button type={'img'} classnames={props.lang === 'ko' ? 'en' : 'ko'} text={props.lang === 'ko' ? '영어로 변경' : '한국어로 변경'} onclick={changeLang} />
                        <Button type={'img'} classnames={'like'} text={'찜한 목록으로'} onclick={viewLikeList} />
                        <Button type={'img'} classnames={'login'} text={'로그인'} onclick={viewLoginPage} />
                    </div>
                </div>
            }
        </div>
    );
};

export default Header;