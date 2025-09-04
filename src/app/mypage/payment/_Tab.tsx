import React, { useState } from 'react';

const MyHistoryTab = ({tab, changeTab}: {tab: string, changeTab: (tabText:string) => void}) => {

    return (
        <div className='tab_area'>
            <div className='tab rounded'>
                <ul>
                    <li className={`${tab === 'ALL' ? 'selected' : ''}`} onClick={() => changeTab('ALL')}>All</li>
                    <li className={`${tab === 'COMPLETED' ? 'selected' : ''}`} onClick={() => changeTab('completed')}>Attended</li>
                    <li className={`${tab === 'CANCELED' ? 'selected' : ''}`} onClick={() => changeTab('canceled')}>Canceled</li>
                </ul> 
            </div>  
        </div>
    );
};

export default MyHistoryTab;