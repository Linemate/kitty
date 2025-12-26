import { buddyProfileProps } from 'types/types';
import MypageHeader from '../_MypageHeader';
import MypageSideMenu from '../_MypageSideMenu';
import Footer from 'components/Footer/Footer';
import Title from 'components/Title/Title';
import Qna from '@/components/QnA/Qna';

const QnaPC = ({buddyInfo}: {buddyInfo: buddyProfileProps | null}) => {

    return (
        <div className='mypage board all'>
            <div className={`wrapper pc`}>
                {/* Header */}
                <MypageHeader buddyInfo={buddyInfo} />
                <div className='contents'>
                    <div className='contents_inner'>
                        <MypageSideMenu />
                        <div className='contents_area'>
                            <div className='intro'>
                                <div>
                                    <Title title={'Q&A'} />
                                </div>
                            </div>                            
                            <div className='board_list_area'>
                                <div className='board_list'>
                                    <Qna isMy={true} size={10} />
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

export default QnaPC;