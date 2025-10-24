import React from 'react';
import { Button } from './Button';

const Paging = ({totalPages, page, changePage}: {totalPages: number, page: number, changePage: (num: number) => void}) => {
    // paging
    const viewPaging = (num:number) => {
        changePage(num);
        window.scrollTo(0, 0);
    }

    // 페이징 왼쪽 방향 버튼
    const viewPrev = () => {
        if(page > 0) {
            changePage(page - 1);
            window.scrollTo(0, 0);
        }
    }

    // 페이징 오른쪽 방향 버튼
    const viewNext = () => {
        if(page < totalPages - 1) {
            changePage(page + 1);
            window.scrollTo(0, 0);
        }
    }
    return (
        <div className='paging'>
            <ul>
                <li className={`${page === 0 ? 'disabled' : ''}`}>
                    <Button type='img' classnames='prev' onclick={() => viewPrev()} text='이전' />
                </li>
                {
                    Array.from({length: totalPages}, (_, index) => (
                        <li key={index} className={`${page === index ? 'selected' : ''}`} onClick={() => viewPaging(index)}>{index + 1}</li>
                    ))
                }
                <li className={`${page === totalPages || page === totalPages - 1 ? 'disabled' : ''}`}>
                    <Button type='img' classnames='next' onclick={() => viewNext()} text='다음' />
                </li>
            </ul>
        </div>
    );
};

export default Paging;