'use client'
import React from 'react';
import Nav from 'components/Nav/Nav';
import { Button } from 'components/common/Button';
import { useRouter } from 'next/navigation';
import 'styles/header.scss';

export type HeaderProps = {
    title: string;
    isDepth? : boolean;
    lang:string;
}

const Header = (props:HeaderProps) => {
    const router = useRouter();
    const changeLang = () => {
        if(props.lang === 'ko') {
            router.push('/en');
        } else {
            router.push('/ko');
        }
    }
    const viewLikeList = () => {
        router.push('/like/list');
    }
    const viewLoginPage = () => {
        router.push('/login');
    }
    return (
        <div className='header'>
            <div className='header_left'>
                <h1>LINEMATE</h1>
                <Nav />
            </div>
            <div className='header_right'>
                <Button type={'img'} classnames={'like'} text={'찜한 목록으로'} onclick={viewLikeList} />
                <Button type={'img'} classnames={props.lang === 'ko' ? 'en' : 'ko'} text={props.lang === 'ko' ? '영어로 변경' : '한국어로 변경'} onclick={changeLang} />
                <Button type={'img'} classnames={'login'} text={'로그인'} onclick={viewLoginPage} />
            </div>
        </div>
    );
};

export default Header;