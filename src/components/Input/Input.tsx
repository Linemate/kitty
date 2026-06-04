'use client'
import React, { useRef, useState } from 'react';
import { inputProps } from 'types/types';
import 'styles/input.scss';

const Input = (props:inputProps) => {
    const {type, value, name, handleChange, placeholder, classnames, onKeyDown, disabled} = props;
    // 텍스트 on
    const [isOn, setIsOn] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        if (inputRef.current && !disabled) {
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
        <div className={`input_wrap ${disabled ? 'disabled' : ''}`} onClick={handleClick}>
            <input type={type} name={name} className={classnames} onChange={handleChange} value={value} ref={inputRef} onBlur={handleBlur} autoComplete="off" onKeyDown={onKeyDown} disabled={disabled} />
            {
                !isOn && placeholder !== '' 
                && value.trim() === '' &&
                <span className='placeholder'>{placeholder}</span>
            }
        </div>
    );
};

export default Input;