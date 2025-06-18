'use client'
import React from 'react';
import 'styles/title.scss'
import { titleProps } from 'types/types';

const Title = (props:titleProps) => {
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