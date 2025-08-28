'use client'
import useMobile from 'hooks/useMobile';
import { useState } from 'react';
import { buddyProfileProps } from 'types/types';
import MyPaymentHistoryPC from './_PCVersion';
import MyPaymentHistoryMobile from './_MobileVersion';

export default function MyPaymentHistory() {
    const isMobile = useMobile();
    const [buddyInfo, setBuddyInfo] = useState<buddyProfileProps | null>(null);
    return (
        <div>
            {
                isMobile ?
                <MyPaymentHistoryMobile buddyInfo={buddyInfo} />
                :
                <MyPaymentHistoryPC buddyInfo={buddyInfo} />
            }
        </div>
    );
}