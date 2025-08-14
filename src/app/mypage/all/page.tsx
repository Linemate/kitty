'use client'
import useMobile from 'hooks/useMobile';
import MyAllReservationsPC from './_PCVersion';
import MyAllReservationsMobile from './_MobileVersion';

export default function MyAllReservations() {
    const isMobile = useMobile();
    return (
        <div>
            {
                isMobile ?
                <MyAllReservationsMobile />
                :
                <MyAllReservationsPC />
            }
        </div>
    );
}