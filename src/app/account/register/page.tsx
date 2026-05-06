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
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordConfirmError, setPasswordConfirmError] = useState('');

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

    const validatePassword = (password: string) => {
        if (!password) return '';
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return 'At least 8 characters, including numbers and special characters.';
        }
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setValues((prev) => {
            const newValues = {
                ...prev,
                [name]: value,
            };

            // Validation logic
            if (name === 'password') {
                const error = validatePassword(value);
                setPasswordError(error);

                // If confirm is already filled, check matching and complexity
                if (newValues.passwordConfirm) {
                    const confirmComplexityError = validatePassword(newValues.passwordConfirm);
                    if (confirmComplexityError) {
                        setPasswordConfirmError(confirmComplexityError);
                    } else if (value !== newValues.passwordConfirm) {
                        setPasswordConfirmError('Passwords do not match.');
                    } else {
                        setPasswordConfirmError('');
                    }
                }
            }

            if (name === 'passwordConfirm') {
                const complexityError = validatePassword(value);
                if (complexityError) {
                    setPasswordConfirmError(complexityError);
                } else if (value && value !== newValues.password) {
                    setPasswordConfirmError('Passwords do not match.');
                } else {
                    setPasswordConfirmError('');
                }
            }

            return newValues;
        });
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
        setEmailError('');
        if (!values.email) {
            setEmailError('Please enter your email.');
            return;
        }
        if (!values.email.includes('@')) {
            setEmailError('Invalid email format.');
            return;
        }

        try {
            await postEmailSendCode(values.email);
            setIsCodeSent(true);
            setTimeLeft(300);
            setIsCodeVerified(false);
            alert('Verification code has been sent.');
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.message || 'Failed to send verification code.';
            setEmailError(errorMessage);
            setIsCodeSent(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!code) {
            return;
        }
        if (timeLeft === 0) {
            alert('Verification time has expired. Please request again.');
            return;
        }
        try {
            await postEmailVerifyCode(values.email, code);
            setIsCodeVerified(true);
            setIsEmailChecked(true);
            setIsCheckable(true);
            alert('Verification complete.');
        } catch (err) {
            alert('The verification code is incorrect or an error occurred.');
            setIsCodeVerified(false);
            setIsEmailChecked(false);
        }
    };

    const handleRegister = async () => {
        if (!values.email || !values.password || !values.locale) {
            alert('Please enter all required information.');
            return;
        }
        if (values.password !== values.passwordConfirm) {
            alert('Passwords do not match.');
            return;
        }
        if (passwordError) {
            alert(passwordError);
            return;
        }
        if (passwordConfirmError) {
            alert(passwordConfirmError);
            return;
        }

        // Check required agreements
        const requiredIds = agreementList.filter(item => item.required).map(item => item.sortOrder);
        const allRequiredChecked = requiredIds.every(id => checkedList.includes(id));

        if (!allRequiredChecked) {
            alert('Please agree to the required terms and conditions.');
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
            const res = await postRegister(payload);
            const returnedName = res?.data?.name || res?.name || '';
            router.push(`/account/register/complete?name=${encodeURIComponent(returnedName)}`);
        } catch (err) {
            console.error('Registration failed:', err);
            alert('Registration failed. Please try again.');
        }
    };

    const isAllChecked = agreementList.length > 0 && checkedList.length === agreementList.length;

    useEffect(() => {
        setIsCodeVerified(false);
        setIsCodeSent(false);
        setCode('');
        setEmailError('');
        if (values.email.length > 0) {
            setIsCheckable(true);
        } else {
            setIsCheckable(false);
        }
    }, [values.email]);

    return (
        <div className="register">
            {
                isMobile &&
                <Header title="" isDepth={true} isMobileDesc={false} isLogin={false} />
            }
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
                                                classnames={emailError ? 'red' : ''}
                                            />
                                        </div>
                                        <Button
                                            type="text"
                                            onclick={isCheckable && !isCodeVerified ? handleSendCode : () => { }}
                                            classnames={`${isCheckable ? isCodeSent ? 'border lightgray' : 'blue border' : 'bg_gray'} radius_8`}
                                            isDisabled={isCodeVerified && isCodeSent}
                                            text={isCodeVerified ? 'Verified' : isCodeSent ? 'Resend' : 'Send Code'}
                                        />
                                    </div>
                                    <div className={`msg ${emailError ? 'red' : ''}`}>
                                        {emailError || 'Notifications regarding meetings will be sent to this email address.'}
                                    </div>
                                    <div className="input_row second">
                                        <div className={`input_area ${isCodeVerified ? 'checked' : ''}`}>
                                            <Input
                                                type="text"
                                                name="code"
                                                value={code}
                                                handleChange={handleCodeChange}
                                                placeholder="Enter verification code"
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
                                            text="Verify"
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
                                        classnames={passwordError ? 'red' : ''}
                                    />
                                    {passwordError && <div className="msg red">{passwordError}</div>}
                                </div>

                                <div className="field">
                                    <Input
                                        type="password"
                                        name="passwordConfirm"
                                        value={values.passwordConfirm}
                                        handleChange={handleChange}
                                        placeholder="Re-enter password"
                                        classnames={passwordConfirmError ? 'red' : ''}
                                    />
                                    {passwordConfirmError && <div className="msg red">{passwordConfirmError}</div>}
                                </div>

                                <div className="field">
                                    <label>Nationality</label>
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

export default function Register() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterContent />
        </Suspense>
    );
}
