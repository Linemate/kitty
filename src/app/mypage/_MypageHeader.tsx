'use client'
import { Button } from 'components/common/Button';
import MypageBtns from './_MypageBtns';
import Header from 'components/Header/Header';
import useMobile from 'hooks/useMobile';
import { useRouter } from 'next/navigation';
import { buddyProfileProps } from 'types/types';
import { formatDate } from 'utils/formatDate';
import { useAuthStore } from 'utils/stores';
import { t } from "utils/i18n";

const MypageHeader = ({ buddyInfo }: { buddyInfo: buddyProfileProps | null }) => {
    const router = useRouter();
    const isMobile = useMobile();
    const userInfo = useAuthStore.getState().userInfo;

    // 프로필 수정
    const handleEditProfile = () => {
        // router.push('/mypage/profile');
        alert(t("준비 중입니다."));
    }
    return (
        <div>
            {/* Header */}
            <Header title={t("라인메이트 메인")} isLogin={userInfo !== null} />
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
                                        <div className="edit_profile" onClick={handleEditProfile}>Edit Profile</div>
                                    </>
                                    :
                                    ''
                            }
                        </div>
                        {
                            isMobile ?
                                '' :

                                <MypageBtns />
                        }
                    </div>
                </div>
                {
                    isMobile ?
                        <MypageBtns /> : ''
                }
            </div>
        </div>
    );
};

export default MypageHeader;