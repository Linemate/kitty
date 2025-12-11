'use client'
import { getMyReviewList, getNoticeList } from 'api';
import Header from 'components/Header/Header';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/mypage.scss';
import { buddyProfileProps, noticeProps, reviewItemProps, reviewProps, } from 'types/types';
import { useRouter } from 'next/navigation';
import { useAuthStore } from 'utils/stores';
import Paging from 'components/common/Paging';

const ReviewMobile = ({buddyInfo}: {buddyInfo: buddyProfileProps | null}) => {
    const [reviewList, setReviewList] = useState<reviewItemProps[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [showNoticeId, setShowNoticeId] = useState<number | null>(null);
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    // 로그인 여부
    const userInfo = useAuthStore.getState().userInfo;

    // 내용 보기
    const viewNotice = (id:number) => {
        if (showNoticeId === id) {
            setShowNoticeId(null);
        } else {
            setShowNoticeId(id);
        }
    }

    const changePage = (num:number) => {
        setPage(num);
    }
    
    // 공지사항 목록
    const loadNoticeList = useCallback(async () => {
        try {
            const res = await getNoticeList(page, 10);
            const data = res.data;
            setReviewList(data);
            setIsLoaded(true);
        } catch (err) {
            if (err && typeof err === 'object' && 'status' in err && 
                err.status === 401) {
                console.log(err)
                alert('로그인이 필요해요.');
                router.push(`/login?redirect=${encodeURIComponent(window.location.origin + '/mypage/payment')}`);
            }
            return;
        }
    }, [page])  

    

    // 내가 쓴 리뷰들 조회
    const loadMyReviewList = useCallback(async () => {
        try {
            const res = await getMyReviewList(page, 10);
            const data = res.data;
            setReviewList(data);
        } catch (err) {
            console.log(err);
        }
    }, [userInfo]);

    useEffect(() => {
        loadMyReviewList();
    }, [loadMyReviewList, page])


    return (
        <div className='mypage board'>
            <div className={`wrapper mobile`}>
                <div className='intro'></div>
                {/* Header */}
                <Header title={'공지사항'} isDepth={true} isLogin={userInfo !== null} />
                <div className='contents'>
                    <div className='contents_inner'>
                        <div className='contents_area'>
                        {
                                isLoaded ? 
                                <>
                                    <div className='board_list_area'>
                                        {
                                            reviewList.length === 0 ? 
                                            <>
                                                <div className="nothing">
                                                    <p className='nothing_text'>
                                                        공지사항이 없습니다. 
                                                    </p>
                                                </div>
                                            </>
                                            :
                                            <div className='board_list'>
                                            {
                                                reviewList.map((el:reviewItemProps, index:number) => (
                                                    <div key={index} className={`board_item ${el.id === showNoticeId ? 'active' : ''}`} onClick={() => viewNotice(el.id)}>
                                                        <dl>
                                                            <dt className='board_title_area'>
                                                                <div className='board_title'>{el.title}</div>
                                                                {/* <div className='board_date'>{el.createdAt}</div> */}
                                                            </dt>
                                                            {
                                                                el.id === showNoticeId ?
                                                                <dd className='board_content_area'>
                                                                    <div className='board_content'>{el.content}</div>
                                                                </dd> : <dd></dd>
                                                            }
                                                        </dl>
                                                    </div>
                                                ))
                                                }
                                            </div>
                                        }
                                    </div>
                                    {
                                        reviewList.length !== 0 ? 
                                        <Paging totalPages={totalPages} page={page} changePage={changePage} />
                                        :
                                        <></>
                                    }
                                </>
                                :
                                <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewMobile;