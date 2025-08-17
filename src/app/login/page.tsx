'use client';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import 'styles/loginPage.scss';
import { useAuthStore, useLanguage } from 'utils/stores';
import Input from 'components/Input/Input';
import { Button } from 'components/common/Button';
import { getLogin } from 'api';
import useMobile from 'hooks/useMobile';
import Header from 'components/Header/Header';

const initValues = {
    email: '',
    password: '',
};
const LoginContent = () => {
    const [values, setValues] = useState(initValues);
    const language = useLanguage((state) => state.language);
    // 로그인 여부
    const userInfo = useAuthStore.getState().userInfo;
    const setUserInfo = useAuthStore.getState().setUserInfo;
    const searchParams = useSearchParams();
    // redirect url
    const redirectUrl = searchParams.get('redirect');

    const router = useRouter();
    const isMobile = useMobile();

    // redirect 할 페이지가 있다면
    const viewPage = useCallback(() => {
        if (window.location.href !== null && redirectUrl) {
            window.location.href = redirectUrl;
        }
    }, [redirectUrl]);

    // input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setValues({
            ...values,
            [name]: value,
        });
    };

    // login
    const handleLogin = useCallback(async () => {
        try {
            const res = await getLogin(values);
            const token = res.data.token;
            if (token) {
                console.log({ ...res.data });
                setUserInfo({ ...res.data });
                if (redirectUrl) {
                    viewPage();
                } else {
                    router.push('/');
                }
            } else {
                alert('계정을 다시 확인해주세요.');
            }
        } catch (err) {
            alert('계정을 다시 확인해주세요.');
        }
    }, [redirectUrl, router, setUserInfo, values, viewPage]);

    useEffect(() => {
        // clearDuplicateCookies();
        return () => {
            setValues(initValues);
        };
    }, []);

    return (
        <div className="login">
            {isMobile && (
                <>
                    {/* Header & Key visual */}
                    <Header title={''} isLogin={userInfo !== null} />
                </>
            )}
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                <div className="contents">
                    {!isMobile && <div className={`img_area ${language}`}></div>}
                    <div className="text_area">
                        <div className="main">
                            <h2 className="logo">Linemate</h2>
                            <p className="intro">Welcome Buddy!</p>
                            <div className="input_area">
                                <div className="email_area">
                                    <Input type="text" name={'email'} value={values.email} handleChange={handleChange} placeholder="Email" />
                                </div>
                                <div className="pw_area">
                                    <Input type="password" name={'password'} value={values.password} handleChange={handleChange} placeholder="Password" />
                                </div>
                            </div>
                            <div className="gray500">Forgot Password?</div>
                            <div className="btn_area">
                                <Button type="text" onclick={handleLogin} classnames="bg_blue wide radius_8" text={'Login'} />
                            </div>
                            {/* <div className='mate_mode'>Switch Mate Mode</div>

                            <div className='gray400'>Don't have an account?<span className='link' onClick={() => viewPage('/register')}>Register</span></div> */}

                            {/* <div className='horizon'><span className='or'>Or</span></div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 최상위 컴포넌트: Suspense로 감싸기
export default function Login() {
    return (
        <Suspense fallback={<div></div>}>
            <LoginContent />
        </Suspense>
    );
}
