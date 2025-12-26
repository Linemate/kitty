'use client'
import { buddyProfileProps } from 'types/types';
import MypageHeader from '../_MypageHeader';
import MypageSideMenu from '../_MypageSideMenu';
import Footer from 'components/Footer/Footer';
import Title from 'components/Title/Title';
import Review from '@/components/Review/Review';

const ReviewPC = ({buddyInfo}: {buddyInfo: buddyProfileProps | null}) => {
    return (
        <div className='mypage review all'>
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
                            
                            <div className='board_list_area'>                                                                
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
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ReviewPC;