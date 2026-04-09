'use client'
import { Button } from 'components/common/Button';
import { postInquiry, refreshToken } from 'api';
import ModalPortal from 'components/Portal/ModalPortal';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import React, { useRef, useState } from 'react';
import { useAuthStore } from 'utils/stores';
import { initPopup } from 'components/Portal/PopupPortal';

const AddQna = ({ id, setPopup, onSuccess, closePortal }: { id: string, setPopup: Function, onSuccess: Function, closePortal: Function }) => {
    const [isSecret, setIsSecret] = useState<boolean>(false);
    const [qnaContent, setQnaContent] = useState<string>('');
    const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
    const setUserInfo = useAuthStore.getState().setUserInfo;

    const inputRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    // 토큰 재발급
    const refreshTokenFn = async () => {
        try {
            const cookies = parseCookies();
            const user = cookies.USERINFO;
            const userInfo = JSON.parse(user);
            if (userInfo) {
                const res = await refreshToken(userInfo.id, userInfo.refreshToken);
                const data = res.data;
                setUserInfo({ ...userInfo, token: data.token, refreshToken: data.refreshToken });
            } else {
                alert('로그인이 필요해요.');
                router.push(`/account/login?redirect=${encodeURIComponent(window.location.origin + '/program/' + id)}`);
                return;
            }
        } catch (err) {
            console.log(err);
        }
    };

    // submit
    const handleSubmit = async () => {
        try {
            const res = await postInquiry(id, { content: qnaContent, isSecret: isSecret });
            if (res.code === 200) {
                setPopup({
                    show: true,
                    children: '문의가 등록되었습니다.',
                    type: 'alert',
                    closePortal: () => {
                        setPopup(initPopup);
                        onSuccess();
                    },
                    noText: '확인',
                });
            } else if (res.code === 401) {
                await refreshTokenFn();
                await handleSubmit();
            } else {
                setPopup({
                    show: true,
                    children: '문의 등록에 실패했습니다.',
                    type: 'alert',
                    closePortal: () => {
                        setPopup(initPopup);
                    },
                    noText: '확인',
                });
            }
            closePortal();
            setIsButtonEnabled(false);
        } catch (err) {
            console.log(err);
            setPopup({
                show: true,
                children: '문의 등록에 실패했습니다.',
                type: 'alert',
                closePortal: () => {
                    setPopup(initPopup);
                },
                noText: '확인',
            });
        }
    };

    // qna 문의하기
    const handleInput = () => {
        if (inputRef.current) {
            // 공백 제외한 글자 수 계산
            const textLength = inputRef.current.innerText.trim().length;
            setIsButtonEnabled(textLength >= 1);
            setQnaContent(inputRef.current.innerText);
        }
    };

    // 비밀글 여부 toggle
    const handlePrivateToggle = () => {
        setIsSecret(!isSecret);
    };
    return (
        <>
            <ModalPortal type='qna' title={'문의 작성하기'} closePortal={closePortal}>
                <div>
                    <div className="input_area">
                        <div ref={inputRef} className={`input_textbox`} contentEditable onInput={handleInput}></div>
                        {qnaContent.trim().length === 0 && <span className="placeholder">문의 내용을 입력해주세요.</span>}
                    </div>
                    <div className="input_checkbox">
                        <label>
                            <input type="checkbox" onChange={handlePrivateToggle} />
                            <span className={`ico checkbox square ${isSecret ? 'checked' : 'default'}`}></span>
                            <span className="text">Private</span>
                        </label>
                    </div>
                    <div className="infobox">
                        <div className="ico info">You can check the response to your inquiry on the program detail page.</div>
                    </div>
                    <div className="btn_area">
                        <Button type={'text'} onclick={handleSubmit} text={'Submit'} classnames={`${isButtonEnabled ? 'bg_blue' : 'bg_gray'} submit`} />
                    </div>
                </div>

            </ModalPortal>
        </>
    );
};

export default AddQna;