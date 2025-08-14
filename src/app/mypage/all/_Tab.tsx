import React, { useState } from 'react';

const MyPageTab = ({tab, changeTab}: {tab: string, changeTab: (tabText:string) => void}) => {

    return (
        <div className='tab_area'>
            <div className='tab rounded'>
                <ul>
                    <li className={`${tab === 'UPCOMING' ? 'selected' : ''}`} onClick={() => changeTab('upcoming')}>Upcoming</li>
                    <li className={`${tab === 'COMPLETED' ? 'selected' : ''}`} onClick={() => changeTab('completed')}>Attended</li>
                    <li className={`${tab === 'CANCELED' ? 'selected' : ''}`} onClick={() => changeTab('canceled')}>Canceled</li>
                </ul> 
            </div>  
        </div>
    );
};

export default MyPageTab;