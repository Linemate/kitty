'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import 'styles/registerPage.scss';
import { useLanguage } from 'utils/stores';
import Input from 'components/Input/Input';
import { Button } from 'components/common/Button';
import useMobile from 'hooks/useMobile';
import Header from 'components/Header/Header';

interface RegisterValues {
    email: string;
    password: string;
    passwordConfirm: string;
    nationality: string;
}

interface MetaAgreement {
    all: boolean;
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
}

const RegisterContent = () => {
    const router = useRouter();
    const isMobile = useMobile();
    const language = useLanguage((state) => state.language);

    const [values, setValues] = useState<RegisterValues>({
        email: '',
        password: '',
        passwordConfirm: '',
        nationality: '',
    });

    const [agreements, setAgreements] = useState<MetaAgreement>({
        all: false,
        terms: false,
        privacy: false,
        marketing: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (name: keyof MetaAgreement) => {
        if (name === 'all') {
            const newValue = !agreements.all;
            setAgreements({
                all: newValue,
                terms: newValue,
                privacy: newValue,
                marketing: newValue,
            });
        } else {
            setAgreements((prev) => {
                const newAgreements = { ...prev, [name]: !prev[name] };
                const allChecked = newAgreements.terms && newAgreements.privacy && newAgreements.marketing;
                // Note: user logic for "all" usually means all required + optional or just all. 
                // Let's assume strictly all checkboxes on screen.
                return { ...newAgreements, all: allChecked };
            });
        }
    };

    const handleDuplicateCheck = () => {
        if (!values.email) {
            alert('이메일을 입력해주세요.');
            return;
        }
        // TODO: Implement API call
        alert('사용 가능한 이메일입니다.');
    };

    const handleRegister = () => {
        if (!values.email || !values.password || !values.nationality) {
            alert('필수 정보를 모두 입력해주세요.');
            return;
        }
        if (values.password !== values.passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!agreements.terms || !agreements.privacy) {
            alert('필수 약관에 동의해주세요.');
            return;
        }
        
        // TODO: Implement API call
        console.log('Registering with:', values, agreements);
        alert('회원가입이 완료되었습니다.'); // Flow simulation
        router.push('/account/login');
    };

    return (
        <div className="register">
            {isMobile && <Header title="Register" isLogin={false} />}
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                <div className="contents">
                    {!isMobile && <div className={`img_area ${language}`}></div>}
                    <div className="text_area">
                        <div className="main">
                            <h2 className="logo">Linemate</h2>
                            <h3 className="title">Join Us</h3>
                            
                            <div className="form_area">
                                <div className="field">
                                    <label>Email ID</label>
                                    <div className="input_row">
                                        <div className="input_wrap">
                                            <Input
                                                type="text"
                                                name="email"
                                                value={values.email}
                                                handleChange={handleChange}
                                                placeholder="Enter your email"
                                                classnames=""
                                            />
                                        </div>
                                        <Button 
                                            type="button" 
                                            onclick={handleDuplicateCheck} 
                                            classnames="bg_gray radius_8" 
                                            text="Check" 
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <label>Password</label>
                                    <Input
                                        type="password"
                                        name="password"
                                        value={values.password}
                                        handleChange={handleChange}
                                        placeholder="Enter password"
                                        classnames=""
                                    />
                                </div>

                                <div className="field">
                                    <label>Confirm Password</label>
                                    <Input
                                        type="password"
                                        name="passwordConfirm"
                                        value={values.passwordConfirm}
                                        handleChange={handleChange}
                                        placeholder="Re-enter password"
                                        classnames=""
                                    />
                                </div>

                                <div className="field">
                                    <label>Nationality</label>
                                    <select 
                                        name="nationality" 
                                        value={values.nationality} 
                                        onChange={handleChange}
                                    >
                                        <option value="">Select your country</option>
                                        <option value="KR">Korea</option>
                                        <option value="US">USA</option>
                                        <option value="JP">Japan</option>
                                        <option value="CN">China</option>
                                        {/* Add more countries as needed */}
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
                                        checked={agreements.all} 
                                        readOnly 
                                    />
                                    <span>Agree to all</span>
                                </div>
                                <div 
                                    className="checkbox_row" 
                                    onClick={() => handleCheckboxChange('terms')}
                                >
                                    <input 
                                        type="checkbox" 
                                        checked={agreements.terms} 
                                        readOnly 
                                    />
                                    <span>Terms of Service <span className="required">(Required)</span></span>
                                </div>
                                <div 
                                    className="checkbox_row" 
                                    onClick={() => handleCheckboxChange('privacy')}
                                >
                                    <input 
                                        type="checkbox" 
                                        checked={agreements.privacy} 
                                        readOnly 
                                    />
                                    <span>Privacy Policy <span className="required">(Required)</span></span>
                                </div>
                                <div 
                                    className="checkbox_row" 
                                    onClick={() => handleCheckboxChange('marketing')}
                                >
                                    <input 
                                        type="checkbox" 
                                        checked={agreements.marketing} 
                                        readOnly 
                                    />
                                    <span>Marketing Information <span className="optional">(Optional)</span></span>
                                </div>
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

export default function Register() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterContent />
        </Suspense>
    );
}
