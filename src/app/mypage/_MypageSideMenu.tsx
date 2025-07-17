'use client'
import useMobile from 'hooks/useMobile';
import React from 'react';

const MypageSideMenu = () => {
    const isMobile = useMobile();
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
                        <div>Payment History</div>
                    </dt>
                </dl>
                <dl>
                    <dt>
                        <div>Notice</div>
                    </dt>
                </dl>
                <dl>
                    <dt>
                        <div>Logout</div>
                    </dt>
                </dl>
            </div>
            </div>
        </div>
    );
};

export default MypageSideMenu;