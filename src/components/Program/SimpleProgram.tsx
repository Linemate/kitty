import Favorite from 'components/Favorite/Favorite';
import ModalPortal from 'components/Portal/ModalPortal';
import useMobile from 'hooks/useMobile';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { bannerProps, popupProps, programSummaryWrapProps } from 'types/types';
import 'styles/program.scss';
import { postProgramLike } from 'api';
import PopupPortal, { initPopup } from 'components/Portal/PopupPortal';
import { useAuthStore } from 'utils/stores';
import Popup from 'components/Portal/Popup';

const SimpleProgram = (props: programSummaryWrapProps) => {
    const { program } = props;
    const [liked, setLiked] = useState<boolean>(false);
    const isMobile = useMobile();
    const router = useRouter();
    const [popup, setPopup] = useState<popupProps>(initPopup);
    const isLogin = useAuthStore.getState().userInfo?.token;
    const sendLike = async () => {
        if (isLogin) {
            await postProgramLike(program.id);
            setLiked(!liked);
        } else {
            setPopup({
                show: true,
                type: 'login',
                children: <div>로그인 후 이용해주세요.</div>,
                closePortal: () => {
                    setPopup(initPopup);
                    router.push(`/account/login?redirect=${encodeURIComponent(window.location.origin + '/program/' + program.id)}`);
                },
                noText: '확인',
            });
        }
    };
    const viewDetails = () => {
        router.push(`/program/${program.id}`);
    };

    return (
        <div className={`program_comp element ${isMobile ? 'mobile' : ''}`}>
            <div className="img_area" onClick={viewDetails} style={{ backgroundImage: `url(${program.thumbnailUrl})` }}>
                <div className="favorite_area">
                    <Favorite onclick={sendLike} isLiked={liked} isFilledHeart={false} size={'md'} />
                </div>
            </div>
            <div className="desc_area">
                <div className="txt_area">
                    <div className="where">{program.station}</div>
                    <h4 onClick={viewDetails}>{program.title}</h4>
                </div>
                <div className="where_favorite_area">
                    <div className="favorite_share_area">
                        <div>
                            <Favorite onclick={sendLike} isLiked={liked} numberOfLike={program.likesCount} size={'sm'} isFilledHeart={true} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bottom_area">
                <div className="price_area">
                    <span className="unit">KRW</span>
                    <span className="amount">{program.price.toLocaleString()}</span>
                </div>
                {/* 여기에 카테고리 들어가야 함 */}
                {/* <div className='category_badge_area'>
                    <div className='badge_area'>
                        <span className='badge'>{program.title}</span>
                    </div>
                </div> */}
            </div>
            {popup.show && (
                <Popup>
                    <PopupPortal type={popup.type} closePortal={popup.closePortal} noText={popup.noText ? popup.noText : '취소'} yesText={'삭제'} yesFunction={popup.yesFunction}>
                        {popup.children}
                    </PopupPortal>
                </Popup>
            )}
        </div>
    );
};

export default SimpleProgram;
