import React from 'react';
import 'styles/button.scss';
import { buttonProps } from 'types/types';

export const Button = (props:buttonProps) => {
    return (
        <>
            <button type="button" className={`btn ${props.type} ${props.classnames}`} onClick={(e) => props.onclick(e)} disabled={props.isDisabled}>{props.text}</button>
        </>
    );
};

// type 항상 text로 고정
export const TextButtonWithIcon = (props:buttonProps) => {
    return (
        <>
            <button type="button" className={`btn text ico ${props.classnames}`} onClick={(e) => props.onclick(e)}>{props.text}</button>
        </>
    )
}