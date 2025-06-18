'use client'
import React, { useState } from 'react';
import Favorite from 'components/Favorite/Favorite';
import 'styles/program.scss';
import { useRouter } from 'next/navigation';
import { Button } from 'components/common/Button';
import ModalPortal from 'components/Portal/ModalPortal';
import useMobile from 'hooks/useMobile';
import { programCompProps } from 'types/types';

const Program = (props:programCompProps) => {
    const {program, isDetails} = props;
    const router = useRouter();
    const [liked, setLiked] = useState<boolean>(false);
    const [isPopup, setIsPopup] = useState<boolean>(false);
    const isMobile = useMobile();
    const sendLike = () => {
        setLiked(!liked);
    }
    const viewDetails = () => {
        router.push(`/program/${program.id}`);
    }
    // 공유하기
    const viewSharePopup = () => {
        setIsPopup(true);
    }
    // 공유하기 닫기
    const closeSharePopup = () => {
        setIsPopup(false);
    }
    // 공유하기
    const shareProgram = (str:string) => {
        console.log(str)
    }
    return (
        <div className={`program_comp ${isMobile ? 'mobile' : ''} ${isDetails ? 'details' : 'element'}`}>
            <div className='img_area' onClick={viewDetails} style={{backgroundImage:`url(${program.thumbnail})`}}>
            </div>
            <div className='desc_area'>
                <div className='txt_area'>
                    <h4 onClick={viewDetails}>{program.title}</h4>
                </div>
                <div className='price_area'>
                    <span className='unit'>
                        {program.currency}
                    </span>
                    <span className='amount'>
                        {program.price.toLocaleString()}
                    </span>
                </div>
                <div className='where_favorite_area'>
                    <div className='where_area'
                    >
                        {program.hiddenInfo.address}
                    </div>
                    <div className='favorite_share_area'>
                        <div>
                            <Favorite onclick={sendLike} isLiked={liked} numberOfLike={program.likes} size={'sm'} isFilledHeart={true} />
                        </div>
                        {
                            isDetails &&
                            <div>
                                <Button type='img' classnames='border share' onclick={viewSharePopup} text='공유하기' />
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className='bottom_area'>
                {
                    !isDetails &&
                    <div className='price_area'>
                        <span className='unit'>
                            KRW
                        </span>
                        <span className='amount'>
                            {program.recommendPrograms.price}
                        </span>
                    </div>
                }
                <div className='category_badge_area'>
                    <div className='badge_area'>
                        {/* map 돌리기 */}
                        <span className='badge'>{program.category.title}</span>
                    </div>
                </div>
            </div>
            {
                isPopup && 
                <ModalPortal title={'Share'} type={'share'} closePortal={closeSharePopup}>
                    <div>
                        <ul>
                            <li onClick={() => shareProgram('kakao')}><div className='ico kakao'>Kakaotalk</div></li>
                            <li onClick={() => shareProgram('facebook')}><div className='ico facebook'>Facebook</div></li>
                            <li onClick={() => shareProgram('copylink')}><div className='ico copylink'>Copy Link</div></li>
                        </ul>
                    </div>
                </ModalPortal>
            }
        </div>
    );
};

export default Program;