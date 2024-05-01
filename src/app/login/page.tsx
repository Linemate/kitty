'use client'
import React from 'react';
import StyledLogin from './StyledLogin';
import Header from 'components/Header/Header';
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();
    const viewPage = (link:string) => {
        router.push(`/${link}`);
    }
    return (
        <StyledLogin>
            <div className='wrapper'>
                <Header title={'라인메이트 로그인'} />
                <div className='contents'>
                    <div className='text_area'>
                        <h2>Welcome!</h2>
                        <p>New to Linemate? <div onClick={() => viewPage('/register')}>Register</div></p>
                    </div>
                    <div className='btn_area'>
                        <button type="button">BUDDY</button>
                        <button type="button">MATE</button>
                    </div>
                </div>
            </div>
        </StyledLogin>
    );
};

export default Login;