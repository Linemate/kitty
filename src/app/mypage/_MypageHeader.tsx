'use client'
import { Button, TextButtonWithIcon } from 'components/common/Button';
import Header from 'components/Header/Header';
import useMobile from 'hooks/useMobile';
import { useRouter } from 'next/navigation';
import { buddyProfileProps } from 'types/types';
import { formatDate } from 'utils/formatDate';
import { useAuthStore } from 'utils/stores';

const MypageHeader = ({ buddyInfo }: { buddyInfo: buddyProfileProps | null }) => {
    const router = useRouter();
    const isMobile = useMobile();
    const userInfo = useAuthStore.getState().userInfo;
    // 페이지 이동
    const viewPage = (pageName: string) => {
        router.push(`/mypage/${pageName}`);
    };
    // 프로필 수정
    const handleEditProfile = () => {
        // router.push('/mypage/profile');
        alert('준비 중입니다.');
    }
    return (
        <div>
            {/* Header */}
            <Header title={'라인메이트 메인'} isLogin={userInfo !== null} />
            <div className="my_info">
                <div className="my_info_inner">
                    <div className="img_area">
                        {
                            buddyInfo && buddyInfo.image.url !== '' ?
                                <img src={buddyInfo.image.url} alt="profile" /> :
                                <div className="none"></div>
                        }
                    </div>
                    <div className="desc_area">
                        <div className="user_desc_area">
                            {
                                buddyInfo ?
                                    <>
                                        <h3 className="user_name">{buddyInfo.name}</h3>
                                        <div className="join_date">{formatDate(buddyInfo.createdAt)} JOIN</div>
                                    </>
                                    :
                                    ''
                            }
                        </div>
                        {
                            isMobile ? <><Button type={'text'} classnames={'wide border lightgray'} text={'프로필 수정'} onclick={handleEditProfile} /></> : ''
                        }
                        <div className="btns_area">
                            <ul>
                                <li>
                                    <TextButtonWithIcon type="text" classnames="top reservations" onclick={() => viewPage('all')} text={'My Events'} />
                                </li>
                                <li>
                                    <TextButtonWithIcon type="text" classnames="top qna" onclick={() => viewPage('qna')} text={'Q&A'} />
                                </li>
                                <li>
                                    <TextButtonWithIcon type="text" classnames="top review" onclick={() => viewPage('review')} text={'Review'} />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MypageHeader;