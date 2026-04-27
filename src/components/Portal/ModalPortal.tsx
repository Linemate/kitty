'use client';
import React from 'react';
import Modal from './Modal';
import 'styles/modal.scss';
import { Button } from 'components/common/Button';
import { modalProps } from 'types/types';
import useMobile from 'hooks/useMobile';
import { t } from "utils/i18n";

const ModalPortal = (props:modalProps) => {
    const isMobile = useMobile();
    const {title, children, type, closePortal} = props;
    // 모달 닫기
    const handleClose = () => {
        closePortal();
    }
    return (
        <Modal>
            <div className={`modal_wrapper ${type} ${isMobile ? 'mobile' : ''}`}>
                <div className='bg' onClick={handleClose}></div>
                <div className='contents'>
                    <div className='modal_header'>
                        <div className='title'>
                            {title}
                        </div>
                        <Button type="img" classnames='close big' onclick={closePortal} text={t("닫기")}  />
                    </div>
                    <div className='modal_body'>
                        {children}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ModalPortal;