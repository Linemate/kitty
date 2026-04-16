'use client';
import React, { useEffect, useState } from 'react';
import useMobile from 'hooks/useMobile';
import { Button } from 'components/common/Button';
import { infoOfProgramProps, reservationHiddenInfoProps } from 'types/types';
import { getReservationHiddenInfo } from 'api';
import Map from 'components/Map/Map';

const InfoOfProgram = (props: infoOfProgramProps) => {
    const isMobile = useMobile();
    const { handleClose, programId, reservationId } = props;
    const [infoOfProgram, setInfoOfProgram] = useState<reservationHiddenInfoProps | null>(null);

    useEffect(() => {
        const getInfoOfProgram = async () => {
            try {
                const res = await getReservationHiddenInfo(programId, reservationId);
                const data = res.data;
                setInfoOfProgram(data);
            } catch (error) {
                console.log(error);
            }
        }
        getInfoOfProgram();
    }, [programId, reservationId])

    return (
        <div className={`info_of_program ${isMobile ? 'mobile' : ''}`}>
            <div className='bg' />
            <div className='info_of_program_inner'>
                <div className='info_of_program_title'>
                    <h2>모임 안내</h2>                                                            
                    <Button text="Close" classnames="close img" type="button" onclick={handleClose} />

                </div>
                <div className='info_of_program_content'>
                    {
                        infoOfProgram &&
                        <>
                            <div className='info_of_program_content_item'>                            
                                {/* <Map /> */}
                                <Map xcoordinate={infoOfProgram.xcoordinate} ycoordinate={infoOfProgram.ycoordinate} isPoint={true}/>
                            </div>
                            <div className='info_of_program_content_item location'>
                                <div className='info_of_program_content_item_title'>모임 장소</div>
                                <div className='info_of_program_content_item_content'>
                                    <div className='info_of_program_content_item_content_title location gray ico'>{infoOfProgram?.address}</div>
                                </div>
                            </div>
                            {
                                infoOfProgram.notice ? 
                                <div className='info_of_program_content_item notice'>
                                    <div className='info_of_program_content_item_title'>공지사항</div>
                                    <div className='info_of_program_content_item_content'>
                                        {infoOfProgram.notice}
                                    </div>
                                </div>
                             : ''
                            }
                            <div className='info_of_program_content_item inquiry'>
                                <div className='info_of_program_content_item_title'>
                                    <div className='ico listen'>메이트에게 문의하기</div>
                                </div>
                                <div className='info_of_program_content_item_content'>
                                모임에 관련된 궁금한 사항은 상세페이지의 Q&A 메뉴를 이용해주세요.
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default InfoOfProgram;