'use client'
import { getMyReviewList, getNoticeList } from 'api';
import Header from 'components/Header/Header';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/mypage.scss';
import { buddyProfileProps, noticeProps, reviewItemProps, reviewProps, } from 'types/types';
import { useRouter } from 'next/navigation';
import { useAuthStore } from 'utils/stores';
import Review from '@/components/Review/Review';

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

    // 내가 쓴 리뷰들 조회
    const loadMyReviewList = useCallback(async () => {
        try {
            const res = await getMyReviewList(page, 10);
            const data = res.data;
            const list = data.list;
            setReviewList(list);
            setIsLoaded(true);
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
                <Header title={'리뷰'} isDepth={true} isLogin={userInfo !== null} />
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
                                                        리뷰가 없습니다. 
                                                    </p>
                                                </div>
                                            </>
                                            :
                                            <div className='board_list'>
                                                <Review isMy={true} size={10} />
                                            </div>
                                        }
                                    </div>
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