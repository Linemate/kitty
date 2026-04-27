'use client';
import React from 'react';
import 'styles/modal.scss';
import { Button } from 'components/common/Button';
import Popup from './Popup';
import { popupProps } from 'types/types';
import { t } from "utils/i18n";

export const initPopup = {
    show: false,
    children: <></>,
    type: 'alert',
    yesFunction: () => {},
    yesText: '',
    noFunction: () => {},
    noText: '',
    closePortal: () => {}
}

const PopupPortal = (props:popupProps) => {
    const {title, children, type, yesFunction, yesText, noFucntion, noText, closePortal} = props;

    // 모달 닫기 & 확인
    const handleConfirm = () => {
        if (yesFunction) {
            yesFunction();
        }
        closePortal();
    }
    // 모달 닫기
    const handleClose = () => {
        if (noFucntion) {
            noFucntion();
        }
        closePortal();
    }
    return (
        <Popup>
            <div className={`popup_wrapper ${type}`}>
                <div className='bg' onClick={handleClose}></div>
                <div className='contents'>
                    <div className='popup_body'>
                        {children}
                    </div>
                    <div className='popup_footer'>
                        <div className='btn' onClick={handleClose}>{noText ? noText : t("취소")}</div>
                        {
                            type === 'confirm' &&
                                <div className='btn confirm' onClick={handleConfirm}>{yesText ? yesText : t("확인")}</div>
                        }
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default PopupPortal;