import Header from 'components/Header/Header';
import 'styles/mypage.scss';
import { buddyProfileProps,  } from 'types/types';
import { useAuthStore } from 'utils/stores';
import Review from '@/components/Review/Review';

const ReviewMobile = ({buddyInfo}: {buddyInfo: buddyProfileProps | null}) => {
    // 로그인 여부
    const userInfo = useAuthStore.getState().userInfo;

    return (
        <div className='mypage review all'>
            <div className={`wrapper mobile`}>
                <div className='intro'></div>
                {/* Header */}
                <Header title={'리뷰'} isDepth={true} isLogin={userInfo !== null} />
                <div className='contents'>
                    <div className='contents_inner'>
                        <div className='contents_area'>                            
                            <div className='board_list_area'>
                                <div className='board_list'>
                                    <Review isMy={true} size={10} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewMobile;