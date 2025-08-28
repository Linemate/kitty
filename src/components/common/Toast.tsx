import React from 'react';
import 'styles/toast.scss';
import { toastProps } from 'types/types';

const Toast = (props:toastProps) => {
    return (
        <div className='toast'>
            <div className={`toast_message ${props.type}`}>
                <p>{props.message}</p>
            </div>
        </div>
    );
};

export default Toast;