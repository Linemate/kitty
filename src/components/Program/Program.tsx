'use client';
import React, { useState } from 'react';
import Favorite from 'components/Favorite/Favorite';
import 'styles/program.scss';
import { useRouter } from 'next/navigation';
import { Button } from 'components/common/Button';
import ModalPortal from 'components/Portal/ModalPortal';
import useMobile from 'hooks/useMobile';
import { popupProps, programCompProps } from 'types/types';
import { useAuthStore } from 'utils/stores';
import { putProgramLike, deleteProgramLike } from 'api';
import Popup from 'components/Portal/Popup';
import PopupPortal, { initPopup } from 'components/Portal/PopupPortal';
import { shareProgram } from '@/utils/share';
import { t } from "utils/i18n";

const Program = (props: programCompProps) => {
    const { program, isDetails } = props;
    const router = useRouter();
    const [liked, setLiked] = useState<boolean>(program.isLike);
    const [isSharePopup, setIsSharePopup] = useState<boolean>(false);
    const [popup, setPopup] = useState<popupProps>(initPopup);
    const isMobile = useMobile();

    // 로그인 여부
    const isLogin = useAuthStore.getState().userInfo?.token;

    const sendLike = async () => {
        if (isLogin) {
            if (liked) {
                await deleteProgramLike(program.id);
            } else {
                await putProgramLike(program.id);
            }
            setLiked(!liked);
        } else {
            setPopup({
                show: true,
                type: 'login',
                children: <div>{t("로그인 후 이용해주세요.")}</div>,
                closePortal: () => {
                    setPopup(initPopup);
                    router.push(`/account/login?redirect=${encodeURIComponent(window.location.origin + '/program/' + program.id + '?pendingLike=true')}`);
                },
                noText: t("확인"),
            });
        }
    };
    const viewDetails = () => {
        router.push(`/program/${program.id}`);
    };
    // 공유하기
    const viewSharePopup = () => {
        setIsSharePopup(true);
    };
    // 공유하기 닫기
    const closeSharePopup = () => {
        setIsSharePopup(false);
    };

    // 공유 완료
    const completedShare = () => {
        setPopup({
            show: true,
            children: t("링크가 복사되었습니다."),
            type: 'alert',
            closePortal: () => {
                setPopup(initPopup);
                closeSharePopup();
            },
            noText: t("확인"),
        });
    }

    // 공유 실패
    const failedShare = () => {
        setPopup({
            show: true,
            children: t("공유에 실패했습니다."),
            type: 'alert',
            closePortal: () => setPopup(initPopup),
            noText: t("확인"),
        });
    }
    return (
        <div className={`program_comp ${isMobile ? 'mobile' : ''} ${isDetails ? 'details' : 'element'}`}>
            <div className="img_area" onClick={viewDetails} style={{ backgroundImage: `url(${program.thumbnail})` }}>
                {isDetails && program.category?.title && (
                    <div className="category_badge">
                        {program.category.title}
                    </div>
                )}
                {!isDetails && (
                    <button
                        className="favorite_area"
                        onClick={(e) => { e.stopPropagation(); sendLike(); }}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                        <img
                            src={liked ? '/assets/images/btn/btn_heart_filled.png' : '/assets/images/btn/btn_heart.png'}
                            alt="찜하기"
                            style={{ width: 32, height: 32, display: 'block' }}
                        />
                    </button>
                )}
            </div>
            <div className="desc_area">
                <div className="txt_area">
                    <h4 onClick={viewDetails}>{program.title}</h4>
                </div>
                <div className="price_area">
                    <span className="unit">{program.currency}</span>
                    <span className="amount">{program.price.toLocaleString()}</span>
                </div>
                <div className="where_favorite_area">
                    {program.hiddenInfo && <div className="where_area">{program.hiddenInfo.address}</div>}
                    <div className="favorite_share_area">
                        <div>
                            <Favorite onclick={sendLike} isLiked={liked} numberOfLike={program.likes} size={'sm'} isFilledHeart={program.isLike && isLogin ? true : false} />
                        </div>
                        {isDetails && (
                            <div>
                                <Button type="img" classnames="border share" onclick={viewSharePopup} text={t("공유하기")} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="bottom_area">
                {/* 여기에 카테고리 들어가야 함 */}
                {/* <div className='category_badge_area'>
                    <div className='badge_area'>
                        <span className='badge'>{program.category.title}</span>
                    </div>
                </div> */}
            </div>
            {isSharePopup && (
                <ModalPortal title={'Share'} type={'share'} closePortal={closeSharePopup}>
                    <div>
                        <ul>
                            <li onClick={() => shareProgram('kakao', program, completedShare, failedShare)}>
                                <div className="ico kakao">Kakaotalk</div>
                            </li>
                            <li onClick={() => shareProgram('facebook', program, completedShare, failedShare)}>
                                <div className="ico facebook">Facebook</div>
                            </li>
                            <li onClick={() => shareProgram('copylink', program, completedShare, failedShare)}>
                                <div className="ico copylink">Copy Link</div>
                            </li>
                        </ul>
                    </div>
                </ModalPortal>
            )}

            {popup.show && (
                <Popup>
                    <PopupPortal type={popup.type} closePortal={popup.closePortal} noText={popup.noText ? popup.noText : t("취소")} yesText={t("삭제")} yesFunction={popup.yesFunction}>
                        {popup.children}
                    </PopupPortal>
                </Popup>
            )}
        </div>
    );
};

export default Program;
