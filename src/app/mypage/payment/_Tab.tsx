import React, { useState } from 'react';
import { t } from "utils/i18n";

const MyHistoryTab = ({tab, changeTab}: {tab: string, changeTab: (tabText:string) => void}) => {

    return (
        <div className='tab_area'>
            <div className='tab rounded'>
                <ul>
                    <li className={`${tab === '' ? 'selected' : ''}`} onClick={() => changeTab('')}>{t("전체")}</li>
                    <li className={`${tab === 'DONE' ? 'selected' : ''}`} onClick={() => changeTab('done')}>{t("결제 완료")}</li>
                    <li className={`${tab === 'CANCELED' ? 'selected' : ''}`} onClick={() => changeTab('canceled')}>{t("취소 완료")}</li>
                </ul> 
            </div>  
        </div>
    );
};

export default MyHistoryTab;