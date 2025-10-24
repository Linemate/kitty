import React, { useState } from 'react';

const MyHistoryTab = ({tab, changeTab}: {tab: string, changeTab: (tabText:string) => void}) => {

    return (
        <div className='tab_area'>
            <div className='tab rounded'>
                <ul>
                    <li className={`${tab === '' ? 'selected' : ''}`} onClick={() => changeTab('')}>전체</li>
                    <li className={`${tab === 'DONE' ? 'selected' : ''}`} onClick={() => changeTab('done')}>결제 완료</li>
                    <li className={`${tab === 'CANCELED' ? 'selected' : ''}`} onClick={() => changeTab('canceled')}>취소 완료</li>
                </ul> 
            </div>  
        </div>
    );
};

export default MyHistoryTab;