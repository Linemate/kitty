import Favorite from 'components/Favorite/Favorite';
import ModalPortal from 'components/Portal/ModalPortal';
import useMobile from 'hooks/useMobile';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { bannerProps, programSummaryWrapProps } from 'types/types';
import 'styles/program.scss';

const SimpleProgram = (props:programSummaryWrapProps) => {
    const { program } = props;
    const [liked, setLiked] = useState<boolean>(false);
    const isMobile = useMobile();
    const router = useRouter();
    
    const sendLike = () => {
        setLiked(!liked);
    }
    const viewDetails = () => {
        router.push(`/program/${program.id}`);
    }

    return (
        <div className={`program_comp element ${isMobile ? 'mobile' : ''}`}>
            <div className='img_area' onClick={viewDetails} style={{backgroundImage:`url(${program.thumbnailUrl})`}}>
                
                <div className='favorite_area'>
                    <Favorite onclick={sendLike} isLiked={liked} isFilledHeart={false} size={'md'} />
                </div>
            </div>
            <div className='desc_area'>
                <div className='txt_area' >
                    <div className='where'>{program.station}</div>
                    <h4 onClick={viewDetails}>{program.title}</h4>
                </div>
                <div className='where_favorite_area'>
                    <div className='favorite_share_area'>
                        <div>
                            <Favorite onclick={sendLike} isLiked={liked} numberOfLike={program.likesCount} size={'sm'} isFilledHeart={true} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='bottom_area'>
                <div className='price_area'>
                    <span className='unit'>
                        KRW
                    </span>
                    <span className='amount'>
                        {program.price}
                    </span>
                </div>
                <div className='category_badge_area'>
                    <div className='badge_area'>
                        {/* map 돌리기 */}
                        <span className='badge'>{program.title}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleProgram;