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
import { t } from "utils/i18n";

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

    const handleChangeMode = () => {
        alert(t("준비중입니다."));
        // router.push('/account/login/mate');
    }

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
                alert(t("계정을 다시 확인해주세요."));
            }
        } catch (err) {
            alert(t("계정을 다시 확인해주세요."));
        }
    }, [redirectUrl, router, setUserInfo, values, viewPage]);

    const handleGoogleLogin = useCallback(() => {
        const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!client_id) {
            alert(t('구글 로그인 설정이 구성되지 않았습니다.'));
            return;
        }
        const redirect_uri = `${window.location.origin}/api/auth/callback/google`;
        const scope = 'openid email profile';
        const state = redirectUrl ? encodeURIComponent(redirectUrl) : '';
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=${encodeURIComponent(scope)}${state ? `&state=${state}` : ''}`;
        window.location.href = url;
    }, [redirectUrl]);

    const handleFacebookLogin = useCallback(() => {
        const client_id = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID;
        if (!client_id) {
            alert(t('페이스북 로그인 설정이 구성되지 않았습니다.'));
            return;
        }
        const redirect_uri = `${window.location.origin}/api/auth/callback/facebook`;
        const scope = 'email,public_profile';
        const state = redirectUrl ? encodeURIComponent(redirectUrl) : '';
        const url = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=${encodeURIComponent(scope)}${state ? `&state=${state}` : ''}`;
        window.location.href = url;
    }, [redirectUrl]);

    useEffect(() => {
        if (userInfo?.token) {
            if (redirectUrl) {
                viewPage();
            } else {
                router.push('/');
            }
        }
        // clearDuplicateCookies();
        return () => {
            setValues(initValues);
        };
    }, [userInfo, redirectUrl, router, viewPage]);

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
                                    <Input
                                        type="text"
                                        name={'email'}
                                        value={values.email}
                                        handleChange={handleChange}
                                        placeholder="Email"
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                            if (e.key === 'Enter') {
                                                handleLogin();
                                            }
                                        }}
                                    />
                                </div>
                                <div className="pw_area">
                                    <Input
                                        type="password"
                                        name={'password'}
                                        value={values.password}
                                        handleChange={handleChange}
                                        placeholder="Password"
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                            if (e.key === 'Enter') {
                                                handleLogin();
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            {/* <div className="gray500">Forgot Password?</div> */}
                            <div className="btn_area">
                                <Button type="text" onclick={handleLogin} classnames="bg_blue wide radius_8" text={'Login'} />
                            </div>
                            <div className='btn_area'>
                                <Button type="text" onclick={handleChangeMode} classnames="underlined gray" text={'Log in as a host'} />
                            </div>
                            <div className='join_area'>
                                <div className='gray400'>Don&apos;t have an account?<span className='link' onClick={() => router.push('/account/register')}>Register</span></div>
                            </div>
                            <div className="horizon">
                                {t('또는')}
                            </div>
                            <div className="social_login_area">
                                <button type="button" className="btn_social facebook" onClick={handleFacebookLogin}>
                                    <img src="/assets/images/icon/ico_facebook.png" alt="Facebook" />
                                </button>
                                <button type="button" className="btn_social google" onClick={handleGoogleLogin}>
                                    <img src="/assets/images/icon/ico_google.png" alt="Google" />
                                </button>
                            </div>
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
