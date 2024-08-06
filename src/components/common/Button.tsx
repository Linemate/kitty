import React from 'react';
import 'styles/button.scss';
export type buttonProps = {
    text:string;
    classnames:string;
    type:string;
    onclick:Function;
}
export const Button = (props:buttonProps) => {
    return (
        <>
            <button type="button" className={`btn ${props.type} ${props.classnames}`} onClick={() => props.onclick()}>{props.text}</button>
        </>
    );
};

// type 항상 text로 고정
export const TextButtonWithIcon = (props:buttonProps) => {
    return (
        <>
            <button type="button" className={`btn text ico ${props.classnames}`} onClick={() => props.onclick()}>{props.text}</button>
        </>
    )
}