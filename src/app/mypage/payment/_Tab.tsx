import React, { useState } from 'react';

const MyHistoryTab = ({tab, changeTab}: {tab: string, changeTab: (tabText:string) => void}) => {

    return (
        <div className='tab_area'>
            <div className='tab rounded'>
                <ul>
                    <li className={`${tab === 'ALL' ? 'selected' : ''}`} onClick={() => changeTab('ALL')}>All</li>
                    <li className={`${tab === 'DONE' ? 'selected' : ''}`} onClick={() => changeTab('done')}>DONE</li>
                    <li className={`${tab === 'CANCELED' ? 'selected' : ''}`} onClick={() => changeTab('canceled')}>CANCELED</li>
                </ul> 
            </div>  
        </div>
    );
};

export default MyHistoryTab;