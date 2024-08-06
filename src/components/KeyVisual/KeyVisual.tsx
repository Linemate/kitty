'use client'
import React, { ReactElement } from 'react';
import 'styles/keyVisual.scss'
import { TextButtonWithIcon } from 'components/common/Button';
import { useRouter } from 'next/navigation';

export type KeyVisualProps = {
    onlyBg?: boolean;
    src?: string;
    children: ReactElement;
}

const KeyVisual = (props:KeyVisualProps) => {
    const router = useRouter();
    const viewMorePage = () => {
        router.push('');
    }
    return (
        <>
            {
                props.onlyBg ? 
                <img src={props.src} alt='key visual' /> : <div className='bg'>
                    <div className='inner'>
                        {props.children}
                    </div>
                </div>
            }
        </>
    );
};

export default KeyVisual;