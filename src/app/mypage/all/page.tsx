'use client'
import useMobile from 'hooks/useMobile';
import MyAllReservationsPC from './_PCVersion';
import MyAllReservationsMobile from './_MobileVersion';
import { useState } from 'react';
import { buddyProfileProps } from 'types/types';

export default function MyAllReservations() {
    const isMobile = useMobile();
    const [buddyInfo, setBuddyInfo] = useState<buddyProfileProps | null>(null);
    return (
        <div>
            {
                isMobile ?
                <MyAllReservationsMobile buddyInfo={buddyInfo} />
                :
                <MyAllReservationsPC buddyInfo={buddyInfo} />
            }
        </div>
    );
}