'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import 'styles/registerPage.scss';
import { useLanguage } from 'utils/stores';
import Input from 'components/Input/Input';
import { Button } from 'components/common/Button';
import useMobile from 'hooks/useMobile';
import Header from 'components/Header/Header';
import { getAgreements, getEmailCheck, getLanguages, postRegister } from 'api';
import { AgreementProps } from 'types/types';

interface RegisterValues {
    email: string;
    password: string;
    passwordConfirm: string;
    nationality: string;
}

const RegisterContent = () => {
    const router = useRouter();
    const isMobile = useMobile();
    const language = useLanguage((state) => state.language);

    const [isCheckable, setIsCheckable] = useState(false);
    const [isEmailChecked, setIsEmailChecked] = useState(false);

    const [values, setValues] = useState<RegisterValues>({
        email: '',
        password: '',
        passwordConfirm: '',
        nationality: '',
    });

    const [agreementList, setAgreementList] = useState<AgreementProps[]>([]);
    const [checkedList, setCheckedList] = useState<number[]>([]);

    const [languages, setLanguages] = useState<string[]>([]);

    const MOCK_AGREEMENTS: AgreementProps[] = [
        { id: 1, title: '이용약관 동의', contents: '', isRequired: true, type: 'TERMS' },
        { id: 2, title: '개인정보 수집 및 이용 동의', contents: '', isRequired: true, type: 'PRIVACY' },
        { id: 3, title: '마케팅 정보 수신 동의', contents: '', isRequired: false, type: 'MARKETING' },
    ];

    useEffect(() => {
        getAgreements().then((data) => {
            if (Array.isArray(data) && data.length > 0) {
                setAgreementList(data);
            } else {
                setAgreementList(MOCK_AGREEMENTS);
            }
        }).catch((err) => {
            console.error('Failed to fetch agreements:', err);
            setAgreementList(MOCK_AGREEMENTS);
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        getLanguages().then((data) => {
            if (Array.isArray(data) && data.length > 0) {
                setLanguages(data);
            }
        }).catch((err) => {
            console.error('Failed to fetch languages:', err);
        });
    }, []);

    const handleCheckboxChange = (id: number | 'all') => {
        if (id === 'all') {
            if (checkedList.length === agreementList.length) {
                setCheckedList([]);
            } else {
                setCheckedList(agreementList.map((item) => item.id));
            }
        } else {
            if (checkedList.includes(id)) {
                setCheckedList(checkedList.filter((item) => item !== id));
            } else {
                setCheckedList([...checkedList, id]);
            }
        }
    };

    const handleDuplicateCheck = async () => {
        if (!values.email) {
            alert('이메일을 입력해주세요.');
            return;
        }
        if (!values.email.includes('@')) {
            alert('이메일 형식이 올바르지 않습니다.');
            return;
        }
        try {
            const res = await getEmailCheck(values.email);
            // Assuming res returned indicates success or availability
            alert('사용 가능한 이메일입니다.');
            setIsEmailChecked(true);
        } catch (err) {
            alert('중복된 이메일이거나 오류가 발생했습니다.');
            setIsEmailChecked(false);
        }
    };

    const handleRegister = async () => {
        if (!values.email || !values.password || !values.nationality) {
            alert('필수 정보를 모두 입력해주세요.');
            return;
        }
        if (values.password !== values.passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        
        // Check required agreements
        const requiredIds = agreementList.filter(item => item.isRequired).map(item => item.id);
        const allRequiredChecked = requiredIds.every(id => checkedList.includes(id));
        
        if (!allRequiredChecked) {
            alert('필수 약관에 동의해주세요.');
            return;
        }
        
        try {
            const consents = agreementList.map(agreement => ({
                type: agreement.type,
                agreed: checkedList.includes(agreement.id)
            }));

            const payload = {
                email: values.email,
                password: values.password,
                locale: values.nationality, 
                consents: consents
            };

            await postRegister(payload);
            router.push(`/account/register/complete?email=${encodeURIComponent(values.email)}`);
        } catch (err) {
            console.error('Registration failed:', err);
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const isAllChecked = agreementList.length > 0 && checkedList.length === agreementList.length;

    useEffect(() => {
        if (values.email.length > 0) {
            setIsCheckable(true);
        } else {
            setIsCheckable(false);
        }
    }, [values.email]);

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
                                            type="text" 
                                            onclick={handleDuplicateCheck} 
                                            classnames={`${isCheckable ? isEmailChecked ? 'border lightgray' : 'bg_blue' : 'bg_gray'} radius_8`} 
                                            text="Check" 
                                        />
                                    </div>
                                    <div className='msg'>
                                        모임 관련 안내가 이 메일 주소로 전송됩니다.
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
                                            key={item.id} 
                                            className="checkbox_row" 
                                            onClick={() => handleCheckboxChange(item.id)}
                                        >
                                            <input 
                                                type="checkbox" 
                                                checked={checkedList.includes(item.id)} 
                                                readOnly 
                                            />
                                            <span>
                                                {item.title} 
                                                <span className={item.isRequired ? "required" : "optional"}>
                                                    {item.isRequired ? "(Required)" : "(Optional)"}
                                                </span>
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{color: '#999', fontSize: '14px', textAlign: 'center'}}>
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

export default function Register() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterContent />
        </Suspense>
    );
}
