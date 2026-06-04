'use client'
import useMobile from 'hooks/useMobile';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useAuthStore } from 'utils/stores';

const MypageSideMenu = () => {
    const isMobile = useMobile();
    const clearToken = useAuthStore.getState().clearToken;
    const router = useRouter();
    const logout = () => {
        clearToken();
        router.push('/');
    }
    return (
        <div>
            <div className="side_menu">
            {
                isMobile ? '' : <h3>MY PAGE</h3>
            }
            <div className="menus">
                {
                    isMobile ? '' : 
                    <dl>
                        <dt>
                            <div>Edit Profile</div>
                        </dt> 
                    </dl>
                }
                <dl>
                    <dt>
                        <Link href='/mypage/payment'>Payment History</Link>
                    </dt>
                </dl>
                <dl>
                    <dt>
                        <Link href='/mypage/notice'>Notice</Link>
                    </dt>
                </dl>
                <dl>
                    <dt>
                        <div onClick={() => logout()}>Logout</div>
                    </dt>
                </dl>
            </div>
            </div>
        </div>
    );
};

export default MypageSideMenu;