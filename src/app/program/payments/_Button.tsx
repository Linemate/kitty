'use client';
import { Button } from 'components/common/Button';
import { useRouter } from 'next/navigation';
import React from 'react';

const BottomButton = ({ style }: { style: string }) => {
    const router = useRouter();
    const viewHome = () => {
        router.push('/');
    };
    return (
        <div className="btn_area">
            <Button classnames={`fit ${style}`} text={'Go to Home'} type="text" onclick={viewHome} />
        </div>
    );
};

export default BottomButton;
