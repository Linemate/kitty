'use client'
import React from 'react';

const MypageSideMenu = () => {
    return (
        <div>
            <div className="side_menu">
            <h3>MY PAGE</h3>
            <div className="menus">
                <dl>
                    <dt>
                        <div>MY SETTING</div>
                    </dt>
                    <dd>
                        <div>Profile</div>
                    </dd>
                    <dd>
                        <div>Personal Information</div>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        <div>PAYMENT</div>
                    </dt>
                </dl>
                <dl>
                    <dt>
                        <div>NOTICE</div>
                    </dt>
                </dl>
                <dl>
                    <dt>
                        <div>LOGOUT</div>
                    </dt>
                </dl>
            </div>
            </div>
        </div>
    );
};

export default MypageSideMenu;