'use client'
import React, { ReactElement } from 'react';
import 'styles/keyVisual.scss'
import { TextButtonWithIcon } from 'components/common/Button';
import { useRouter } from 'next/navigation';
import { keyVisualProps } from 'types/types';

const KeyVisual = (props:keyVisualProps) => {
    const router = useRouter();
    const viewMorePage = () => {
        router.push('');
    }
    return (
        <div className='key_visual_wrapper'>
            {
                props.onlyBg ? 
                <img src={props.src} alt='key visual' /> : <div className='bg'>
                    <div className='inner'>
                        {props.children}
                    </div>
                </div>
            }
        </div>
    );
};

export default KeyVisual;