'use client'
import React, { useRef, useState } from 'react';
import { inputProps } from 'types/types';
import 'styles/input.scss';

const Input = (props:inputProps) => {
    const {type, value, name, handleChange, placeholder, classnames, onKeyDown} = props;
    // 텍스트 on
    const [isOn, setIsOn] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
            setIsOn(true);
        }
    }
    const handleBlur = () => {
        if (inputRef.current) {
            inputRef.current.blur();
            setIsOn(false);
        }
    }
    return (
        <div className='input_wrap' onClick={handleClick}>
            <input type={type} name={name} className={classnames} onChange={handleChange} value={value} ref={inputRef} onBlur={handleBlur} autoComplete="off" onKeyDown={onKeyDown} />
            {
                !isOn && placeholder !== '' 
                && value.trim() === '' &&
                <span className='placeholder'>{placeholder}</span>
            }
        </div>
    );
};

export default Input;