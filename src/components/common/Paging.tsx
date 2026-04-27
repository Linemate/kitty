import React from 'react';
import { Button } from './Button';
import { t } from "utils/i18n";

const Paging = ({totalPages, page, changePage}: {totalPages: number, page: number, changePage: (num: number) => void}) => {
    // paging
    const viewPaging = (num:number) => {
        changePage(num);
    }

    // visible page range (max 9)
    const maxVisible = 9;
    const half = Math.floor(maxVisible / 2);
    const start = Math.max(0, Math.min(page - half, Math.max(0, totalPages - maxVisible)));
    const end = Math.min(totalPages, start + maxVisible);

    // 페이징 왼쪽 방향 버튼
    const viewPrev = () => {
        if(page > 0) {
            changePage(page - 1);
        }
    }

    // 페이징 오른쪽 방향 버튼
    const viewNext = () => {
        if(page < totalPages - 1) {
            changePage(page + 1);
        }
    }
    return (
        <div className='paging'>
            <ul>
                <li className={`${page === 0 ? 'disabled' : ''}`}>
                    <Button type='img' classnames='prev' onclick={() => viewPrev()} text={t("이전")} />
                </li>
                {
                    Array.from({length: end - start}, (_, i) => {
                        const index = start + i;
                        return (
                            <li key={index} className={`${page === index ? 'selected' : ''}`} onClick={() => viewPaging(index)}>{index + 1}</li>
                        );
                    })
                }
                <li className={`${page === totalPages || page === totalPages - 1 ? 'disabled' : ''}`}>
                    <Button type='img' classnames='next' onclick={() => viewNext()} text={t("다음")} />
                </li>
            </ul>
        </div>
    );
};

export default Paging;