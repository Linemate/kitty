'use client'
import React from 'react';
import 'styles/title.scss'

export type TitleProps = {
    title: string;
    description?: string;
    icon?:string;
}

const Title = (props:TitleProps) => {
    return (
        <div className='title'>
            <h3 className={props.icon ? `ico ${props.icon}` : ''}>{props.title}</h3>
            <p>
                {props.description}
            </p>
        </div>
    );
};

export default Title;