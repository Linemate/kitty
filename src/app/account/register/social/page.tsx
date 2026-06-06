'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import 'styles/registerPage.scss';
import { useAuthStore, useLanguage } from 'utils/stores';
import Input from 'components/Input/Input';
import { Button } from 'components/common/Button';
import useMobile from 'hooks/useMobile';
import Header from 'components/Header/Header';
import { getAgreements, getLanguages, postRegisterSocialComplete } from 'api';
import { AgreementProps } from 'types/types';

interface RegisterValues {
    email: string;
    locale: string;
}

const SocialRegisterContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const provider = searchParams.get('provider');
    const signupToken = searchParams.get('signupToken');
    const emailParam = searchParams.get('email') || '';
    const redirectUrl = searchParams.get('redirect') || '';

    const isMobile = useMobile();
    const language = useLanguage((state) => state.language);

    const [values, setValues] = useState<RegisterValues>({
        email: emailParam,
        locale: '',
    });

    const [agreementList, setAgreementList] = useState<AgreementProps[]>([]);
    const [checkedList, setCheckedList] = useState<number[]>([]);
    const [languages, setLanguages] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        getAgreements().then((data) => {
            const list = data.data;
            if (Array.isArray(list) && list.length > 0) {
                setAgreementList(list);
            }
        }).catch((err) => {
            console.error('Failed to fetch agreements:', err);
            setAgreementList([]);
        });
    }, []);

    useEffect(() => {
        getLanguages().then((data) => {
            if (Array.isArray(data) && data.length > 0) {
                setLanguages(data);
                setValues((prev) => ({
                    ...prev,
                    locale: data[0],
                }));
            }
        }).catch((err) => {
            console.error('Failed to fetch languages:', err);
        });
    }, []);

    const handleCheckboxChange = (sortOrder: number | 'all') => {
        if (sortOrder === 'all') {
            if (checkedList.length === agreementList.length) {
                setCheckedList([]);
            } else {
                setCheckedList(agreementList.map((item) => item.sortOrder));
            }
        } else {
            if (checkedList.includes(sortOrder)) {
                setCheckedList(checkedList.filter((item) => item !== sortOrder));
            } else {
                setCheckedList([...checkedList, sortOrder]);
            }
        }
    };

    const handleRegister = async () => {
        // Check required agreements
        const requiredIds = agreementList.filter(item => item.required).map(item => item.sortOrder);
        const allRequiredChecked = requiredIds.every(id => checkedList.includes(id));

        if (!allRequiredChecked) {
            alert('Please agree to the required terms and conditions.');
            return;
        }

        const consents = agreementList.map(agreement => ({
            type: agreement.code,
            agreed: checkedList.includes(agreement.sortOrder)
        }));

        if (signupToken) {
            try {
                // 국적(locale) 값도 필요하다면 백엔드 API에 맞게 조정해야 하지만 명세엔 consents만 있음
                const res = await postRegisterSocialComplete(signupToken, consents);
                const userData = res?.data || res;
                if (userData && userData.token) {
                    const setUserInfo = useAuthStore.getState().setUserInfo;
                    setUserInfo(userData);
                }

                // 회원가입 완료 시 바로 리다이렉트 또는 홈으로 이동
                if (redirectUrl) {
                    window.location.href = decodeURIComponent(redirectUrl);
                } else {
                    router.push('/');
                }
            } catch (err: any) {
                console.error('Social registration failed:', err);
                if (err.response?.status === 401) {
                    alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
                    router.push('/account/login/buddy');
                } else if (err.response?.status === 400) {
                    alert('필수 동의 항목이 누락되었습니다.');
                } else {
                    alert('Social registration failed. Please try again.');
                }
            }
        } else {
            alert('Invalid signup token.');
        }
    };

    const isAllChecked = agreementList.length > 0 && checkedList.length === agreementList.length;

    return (
        <div className="register">
            {
                isMobile &&
                <Header title="" isDepth={true} isMobileDesc={false} isLogin={false} />
            }
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                <div className="contents">
                    {!isMobile && <div className={`img_area ${language}`}></div>}
                    <div className="contents_wrap">
                        <div className="main">
                            <h2 className="logo">Linemate</h2>
                            <h3 className="title">회원가입 완료하기</h3>

                            <div className="form_area">
                                <div className="field">
                                    <label>Email ID</label>
                                    <div className="input_row">
                                        <div className="input_area">
                                            <Input
                                                type="text"
                                                name="email"
                                                value={values.email}
                                                handleChange={() => { }}
                                                placeholder=""
                                                classnames="bg_gray"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="field">
                                    <label>Nationality(Optional)</label>
                                    <select
                                        name="locale"
                                        value={values.locale}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select nationality</option>
                                        {languages.map((language) => (
                                            <option key={language} value={language}>
                                                {language}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="agreement_area">
                                <div
                                    className="checkbox_row all_agree"
                                    onClick={() => handleCheckboxChange('all')}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isAllChecked}
                                        readOnly
                                    />
                                    <span>Agree to all</span>
                                </div>
                                {agreementList.length > 0 ? (
                                    agreementList.map((item) => (
                                        <div
                                            key={item.sortOrder}
                                            className="agreement_row"
                                        >
                                            <div
                                                className="checkbox_row" onClick={() => handleCheckboxChange(item.sortOrder)}>
                                                <input
                                                    type="checkbox"
                                                    checked={checkedList.includes(item.sortOrder)}
                                                    readOnly
                                                />
                                                <span>
                                                    {item.name}
                                                    <span>
                                                        {item.required ? "(Required)" : "(Optional)"}
                                                    </span>
                                                </span>
                                            </div>
                                            {(item.code === 'PRIVACY_POLICY' || item.code === 'TERMS_OF_SERVICE') && (
                                                <span
                                                    className='btn_show_details'
                                                    onClick={() => {
                                                        if (item.code === 'PRIVACY_POLICY') {
                                                            window.open('https://policy.linemate.kr/service.html#privacy', '_blank');
                                                        } else if (item.code === 'TERMS_OF_SERVICE') {
                                                            window.open('https://policy.linemate.kr/service.html#tos', '_blank');
                                                        }
                                                    }}
                                                >Show Details</span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ color: '#999', fontSize: '14px', textAlign: 'center' }}>
                                        Loading agreements...
                                    </div>
                                )}
                            </div>

                            <div className="btn_area">
                                <Button
                                    type="text"
                                    onclick={handleRegister}
                                    classnames="bg_blue wide radius_8"
                                    text="Next"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function SocialRegister() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SocialRegisterContent />
        </Suspense>
    );
}
