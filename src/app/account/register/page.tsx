'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import 'styles/registerPage.scss';
import { useLanguage } from 'utils/stores';
import Input from 'components/Input/Input';
import { Button } from 'components/common/Button';
import useMobile from 'hooks/useMobile';
import Header from 'components/Header/Header';
import { getAgreements, getLanguages, postRegister, postEmailSendCode, postEmailVerifyCode } from 'api';
import { AgreementProps } from 'types/types';

interface RegisterValues {
    email: string;
    password: string;
    passwordConfirm: string;
    locale: string;
}

const RegisterContent = () => {
    const router = useRouter();
    const isMobile = useMobile();
    const language = useLanguage((state) => state.language);

    const [isCheckable, setIsCheckable] = useState(false);
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [code, setCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(300);
    const [isCodeVerified, setIsCodeVerified] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isCodeSent && !isCodeVerified && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isCodeSent, isCodeVerified, timeLeft]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCode(e.target.value);
    };

    const [values, setValues] = useState<RegisterValues>({
        email: '',
        password: '',
        passwordConfirm: '',
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

    const handleSendCode = async () => {
        if (!values.email) {
            alert('이메일을 입력해주세요.');
            return;
        }
        if (!values.email.includes('@')) {
            alert('이메일 형식이 올바르지 않습니다.');
            return;
        }
        try {
            await postEmailSendCode(values.email);
            setIsCodeSent(true);
            setTimeLeft(300);
            setIsCodeVerified(false);
            alert('인증번호가 발송되었습니다.');
        } catch (err) {
            alert('인증번호 발송에 실패했습니다.');
            setIsCodeSent(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!code) {
            return;
        }
        if (timeLeft === 0) {
            alert('인증 시간이 만료되었습니다. 다시 요청해주세요.');
            return;
        }
        try {
            await postEmailVerifyCode(values.email, code);
            setIsCodeVerified(true);
            setIsEmailChecked(true);
            setIsCheckable(true);
            alert('인증이 완료되었습니다.');
        } catch (err) {
            alert('인증번호가 올바르지 않거나 오류가 발생했습니다.');
            setIsCodeVerified(false);
            setIsEmailChecked(false);
        }
    };

    const handleRegister = async () => {
        console.log(values)
        if (!values.email || !values.password || !values.locale) {
            alert('필수 정보를 모두 입력해주세요.');
            return;
        }
        if (values.password !== values.passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        // Check required agreements
        const requiredIds = agreementList.filter(item => item.required).map(item => item.sortOrder);
        const allRequiredChecked = requiredIds.every(id => checkedList.includes(id));

        if (!allRequiredChecked) {
            alert('필수 약관에 동의해주세요.');
            return;
        }

        try {
            const consents = agreementList.map(agreement => ({
                type: agreement.code,
                agreed: checkedList.includes(agreement.sortOrder)
            }));

            const payload = {
                email: values.email,
                password: values.password,
                locale: values.locale,
                consents: consents
            };

            console.log(payload);
            await postRegister(payload);
            router.push(`/account/register/complete?email=${encodeURIComponent(values.email)}`);
        } catch (err) {
            console.error('Registration failed:', err);
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const isAllChecked = agreementList.length > 0 && checkedList.length === agreementList.length;

    useEffect(() => {
        setIsCodeVerified(false);
        setIsCodeSent(false);
        setCode('');
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
                                        <div className="input_area">
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
                                            onclick={isCheckable && !isCodeVerified ? handleSendCode : () => { }}
                                            classnames={`${isCheckable ? isCodeSent ? 'border lightgray' : 'blue border' : 'bg_gray'} radius_8`}
                                            isDisabled={isCodeVerified && isCodeSent}
                                            text={isCodeVerified ? '인증 완료' : isCodeSent ? '인증 재요청' : '인증 요청'}
                                        />
                                    </div>
                                    <div className='msg'>
                                        모임 관련 안내가 이 메일 주소로 전송됩니다.
                                    </div>
                                    <div className="input_row second">
                                        <div className={`input_area ${isCodeVerified ? 'checked' : ''}`}>
                                            <Input
                                                type="text"
                                                name="code"
                                                value={code}
                                                handleChange={handleCodeChange}
                                                placeholder="인증 번호 입력"
                                                classnames=""
                                            />
                                            {isCodeSent && !isCodeVerified && (
                                                <span className='timer'>
                                                    {formatTime(timeLeft)}
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            type="text"
                                            onclick={!isCodeVerified && code.length > 0 ? handleVerifyCode : () => { }}
                                            classnames={`${!isCodeVerified && code.length > 0 ? 'bg_blue' : 'bg_gray'} radius_8`}
                                            isDisabled={isCodeVerified}
                                            text="인증하기"
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
                                    <label>locale</label>
                                    <select
                                        name="locale"
                                        value={values.locale}
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
                                                        {item.required ? "(필수)" : "(선택)"}
                                                    </span>
                                                </span>
                                            </div>
                                            <span className='btn_show_details'>Show Details</span>
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

export default function Register() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterContent />
        </Suspense>
    );
}
