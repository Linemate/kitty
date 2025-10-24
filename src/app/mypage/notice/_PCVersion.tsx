'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { buddyProfileProps, noticeProps } from 'types/types';
import { useRouter } from 'next/navigation';
import { getNoticeList } from 'api';
import MypageHeader from '../_MypageHeader';
import MypageSideMenu from '../_MypageSideMenu';
import Footer from 'components/Footer/Footer';
import Title from 'components/Title/Title';
import Paging from 'components/common/Paging';

const NoticePC = ({buddyInfo}: {buddyInfo: buddyProfileProps | null}) => {
    const [noticeList, setNoticeList] = useState<noticeProps[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [showNoticeId, setShowNoticeId] = useState<number | null>(null);
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
 
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

    // 공지사항
    const loadNoticeList = useCallback(async () => {
        try {
            const res = await getNoticeList(page, 10);
            const data = res.data;
            setNoticeList(data);
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

    useEffect(() => {
        loadNoticeList();
    }, [loadNoticeList, page])

    return (
        <div className='mypage board'>
            <div className={`wrapper pc`}>
                {/* Header */}
                <MypageHeader buddyInfo={buddyInfo} />
                <div className='contents'>
                    <div className='contents_inner'>
                        <MypageSideMenu />
                        <div className='contents_area'>
                            <div className='intro'>
                                <div>
                                    <Title title={'공지사항'} />
                                </div>
                            </div>
                            {
                                isLoaded ? 
                                <>
                                    <div className='board_list_area'>
                                        {
                                            noticeList.length === 0 ? 
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
                                                noticeList.map((el:noticeProps, index:number) => (
                                                    <div key={index} className={`board_item ${el.id === showNoticeId ? 'active' : ''}`} onClick={() => viewNotice(el.id)}>
                                                        <dl>
                                                            <dt className='board_title_area'>
                                                                <div className='board_title'>{el.title}</div>
                                                                <div className='board_date'>{el.createdAt}</div>
                                                            </dt>
                                                            {
                                                                el.id === showNoticeId ?
                                                                <dd className='board_content_area'>
                                                                    <div className='board_content'>{el.contents}</div>
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
                                        noticeList.length !== 0 ? 
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

export default NoticePC;