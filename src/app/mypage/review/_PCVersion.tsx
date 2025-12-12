'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { buddyProfileProps, reviewItemProps } from 'types/types';
import { useRouter } from 'next/navigation';
import { getMyReviewList, getNoticeList } from 'api';
import MypageHeader from '../_MypageHeader';
import MypageSideMenu from '../_MypageSideMenu';
import Footer from 'components/Footer/Footer';
import Title from 'components/Title/Title';
import Paging from 'components/common/Paging';
import { useAuthStore } from 'utils/stores';

const ReviewPC = ({buddyInfo}: {buddyInfo: buddyProfileProps | null}) => {
    const [reviewList, setReviewList] = useState<reviewItemProps[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [showNoticeId, setShowNoticeId] = useState<number | null>(null);
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
 
    // 로그인 여부
    const userInfo = useAuthStore.getState().userInfo;
    
    const changePage = (num:number) => {
        setPage(num);
    }

    // 내용 보기
    const viewNotice = (id:number) => {
        if (showNoticeId === id) {
            setShowNoticeId(null);
        } else {
            setShowNoticeId(id);
        }
    }

    // 리뷰
    const loadNoticeList = useCallback(async () => {
        try {
            const res = await getNoticeList(page, 10);
            const data = res.data;
            const list = data.list;
            setReviewList(list);
            setIsLoaded(true);
        } catch (err) {
            if (err && typeof err === 'object' && 'status' in err && 
                err.status === 401) {
                console.log(err)
                alert('로그인이 필요해요.');
                router.push(`/login?redirect=${encodeURIComponent(window.location.origin + '/mypage/payment')}`);
            }
            setIsLoaded(true);
            return;
        }
    }, [page, router])

    

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

    // 리뷰로 이동
    const viewReview = (id:number) => {
        router.push(`/mypage/review/${id}`);
    }

    useEffect(() => {
        loadNoticeList();
    }, [loadNoticeList, page])

    return (
        <div className='mypage review'>
            <div className={`wrapper pc`}>
                {/* Header */}
                <MypageHeader buddyInfo={buddyInfo} />
                <div className='contents'>
                    <div className='contents_inner'>
                        <MypageSideMenu />
                        <div className='contents_area'>
                            <div className='intro'>
                                <div>
                                    <Title title={'Review'} />
                                </div>
                            </div>
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
                                            {
                                                reviewList.map((el:reviewItemProps, index:number) => (
                                                    <div key={index} className={`board_item`} onClick={() => viewReview(el.id)}>
                                                        <dl>
                                                            <dt className='board_title_area'>
                                                                <div className='board_title'>{el.title}</div>
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
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ReviewPC;