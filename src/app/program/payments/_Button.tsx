'use client';
import { Button } from 'components/common/Button';
import { useRouter } from 'next/navigation';
import React from 'react';

const BottomButton = (props: { text: string; style: string; href: string }) => {
    const { text, style, href } = props;
    const router = useRouter();
    const viewHome = () => {
        router.push(href);
    };
    return (
        <div className="btn_area">
            <Button classnames={`fit ${style}`} text={text} type="text" onclick={viewHome} />
        </div>
    );
};

export default BottomButton;
