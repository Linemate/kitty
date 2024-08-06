'use client'
import React, { useState } from 'react';
import 'styles/mypage.scss';
const MyPage = () => {
    const [folded, setFolded] = useState<boolean>(false);
    return (
        <div className={`mypage`}>
            <div className='side_menu'>
                <div className='top'>
                    <div className='title'>
                        <span className='text'>MY PAGE</span> 
                        <button type="button" className='btn fold' onClick={() =>setFolded(!folded)}>접기/펴기</button>
                    </div>
                    <dl>
                        <dt>LINEMATE PROGRAM</dt>
                        <dd>
                            <div>RESERVATION</div>
                        </dd>
                        <dd>
                            <div>REVIEW</div>
                        </dd>
                        <dd>
                            <div>LIKE</div>
                        </dd>
                    </dl>
                    <dl>
                        <dt>MY SETTINGS</dt>
                        <dd>
                            <div>PROFILE</div>
                        </dd>
                        <dd>
                            <div>PERSONAL INFORMATION</div>
                        </dd>
                    </dl>
                    <dl>
                        <dt>PAYMENT</dt>
                    </dl>
                    <dl>
                        <dt>NOTICE</dt>
                    </dl>
                </div>
                <div className='bottom'>
                    <dl className='logout'>
                        <dt>LOGOUT</dt>
                    </dl>
                </div>
            </div>
            
        </div>
    );
};

export default MyPage;