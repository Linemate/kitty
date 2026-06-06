'use client';
import React from 'react';
import { TextButtonWithIcon } from 'components/common/Button';
import { useRouter } from 'next/navigation';

const MypageBtns = () => {
    const router = useRouter();

    const viewPage = (pageName: string) => {
        router.push(`/mypage/${pageName}`);
    };

    return (
        <div className="btns_area">
            <ul>
                <li>
                    <TextButtonWithIcon type="text" classnames="top reservations" onclick={() => viewPage('all')} text={'My Events'} />
                </li>
                <li>
                    <TextButtonWithIcon type="text" classnames="top qna" onclick={() => viewPage('qna')} text={'Q&A'} />
                </li>
                <li>
                    <TextButtonWithIcon type="text" classnames="top like" onclick={() => viewPage('likes')} text={'Like'} />
                </li>
                <li>
                    <TextButtonWithIcon type="text" classnames="top review" onclick={() => viewPage('review')} text={'Review'} />
                </li>
            </ul>
        </div>
    );
};

export default MypageBtns;
