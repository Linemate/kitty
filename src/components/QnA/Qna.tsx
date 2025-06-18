import ModalPortal from 'components/Portal/ModalPortal';
import Modal from 'components/Portal/Modal';
import { Button } from 'components/common/Button';
import React, { useRef, useState } from 'react';
import 'styles/qna.scss';
import PopupPortal, { initPopup } from 'components/Portal/PopupPortal';
import Popup from 'components/Portal/Popup';
import useMobile from 'hooks/useMobile';
import { popupProps, qnaItemProps, qnaProps } from 'types/types';
import { getInquiries } from 'api';



const QnaItem = (props:qnaProps) => {
    const {qna, handleDelete} = props;
    const {id, buddy, title, content, answer, isSecret, createdAt} = qna;
    const [seeMore, setSeeMore] = useState<boolean>(true);
    const handleQnaDelete = () => {
        console.log('delete');
        handleDelete(id);
    }
    const handleSeeMore= () => {
        setSeeMore(false);
    }
    return (
        <div className={`qna`}>
            <div className='qna_header'>
                <div className='left'>
                    {
                        answer.id ?
                        <span className='is_reply no_reply'>답변완료</span>
                        :
                        <span className='is_reply reply'>미답변</span>
                    }
                    <span className='username'>{buddy.name}</span>
                    <span className='date'>{createdAt}</span>
                </div>
                {
                    !answer.id &&
                    <div className='right'>
                        <Button classnames={'lightgray'} type={'text'} text={`Delete`} onclick={handleQnaDelete} />
                    </div>
                }
            </div>
            <div className='qna_body'>
                {
                    isSecret ? 
                    <div className='ico lock qna_contents'>Private post.</div>
                    :
                    <div className='qna_contents'>
                        {
                            seeMore ? content?.substring(0, 200) : content
                        }
                        {
                            seeMore && content && content.length >= 200 && '...'
                        }
                        {
                            seeMore && content && content.length >= 200 &&
                            <div className='see_more_wrap'>
                                <Button classnames={'lightgray'} type={'text'} text={`See More`} onclick={handleSeeMore} />
                            </div>
                        }
                    </div>
                }
                {
                    // 답변
                    answer.id && 
                    <div className='reply'>
                        <div className='reply_contents'>
                            {
                                isSecret ? 'Private post.' : answer.contents
                            }
                        </div>
                        <div className='reply_date'>
                            {answer.createdAt}
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

const Qna = ({id} : {id:string}) => {
    const [modal, setModal] = useState<boolean>(false);
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [popup, setPopup] = useState<popupProps>(initPopup);
    const [qnaContent, setQnaContent] = useState<string>('');
    const [qnas, setQnas] = useState<qnaItemProps[]>([]);
    const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
    // page
    const [pageNum, setPageNum] = useState<number>(0);

    const inputRef = useRef<HTMLDivElement>(null);
    const isMobile = useMobile();
    const viewAsk = () => {
        setModal(true);
    }
    const closePortal = () => {
        setModal(false);
    }

    // qna 조회
    const loadInquiries = async () => {
        try {
            const res = await getInquiries(id, pageNum)
        } catch(err) {console.log(err)}
    }


    // qna 문의하기
    const handleInput = () => {
        if (inputRef.current) {
            // 공백 제외한 글자 수 계산
            const textLength = inputRef.current.innerText.trim().length;
            setIsButtonEnabled(textLength >= 1);
            setQnaContent(inputRef.current.innerText);
        }
    }

    // 비밀글 여부 toggle
    const handlePrivateToggle = () => {
        setIsPrivate(!isPrivate);
    }
    // submit
    const handleSubmit = () => {
        setModal(false);
    }

    // qna 삭제
    const handleConfirmDelete = (id:number) => {

    }

    // qna 삭제 여부
    const handleDelete = (id:number) => {
        setPopup({
            show: true,
            children: '작성한 문의를 삭제 하시겠습니까?',
            type: 'confirm',
            yesFunction: () => {
                handleConfirmDelete(id)
            },
            closePortal : () => {
                setPopup(initPopup)
            }
        });
    }
    return (
        <div className={`qna_area ${isMobile ? 'mobile' : ''}`}>
            <div className='btn_area'>
                <Button classnames='fit border lightgray' text={'Ask a question'} type='text' onclick={viewAsk} />
            </div>
            <div>
                {
                    qnas.map((el:qnaItemProps) => <QnaItem qna={el} key={el.id} handleDelete={() => handleDelete(el.id)} />)
                }
            </div>
            {
                modal &&
                <Modal>
                    <ModalPortal type={'qna'} title={'문의 작성하기'} closePortal={closePortal}>
                        <div>
                            <div className='input_area'>
                                <div ref={inputRef} className={`input_textbox`} contentEditable onInput={handleInput}></div>
                                {
                                    qnaContent.trim().length === 0 &&
                                    <span className='placeholder'>문의 내용을 입력해주세요.</span>
                                }
                            </div>
                            <div className='input_checkbox'>
                                <label>
                                    <input type="checkbox" onChange={handlePrivateToggle} />
                                    <span className={`ico checkbox square ${isPrivate ? 'default' : 'checked'}`}></span>
                                    <span className='text'>Private</span>
                                </label>
                            </div>
                            <div className='infobox'>
                                <div className='ico info'>You can check the response to your inquiry on the program detail page.</div>
                            </div>
                            <div className='btn_area'>
                                <Button type={'text'} onclick={handleSubmit} text={'Submit'} classnames={`${isButtonEnabled ? 'bg_blue' : 'bg_gray'} submit`} />
                            </div>
                        </div>
                    </ModalPortal>
                </Modal>
            }
            {
                popup.show &&
                <Popup>
                    <PopupPortal type={popup.type} closePortal={popup.closePortal} yesText={'삭제'} yesFunction={popup.yesFunction}>
                        {popup.children}
                    </PopupPortal>
                </Popup>
            }
        </div>
    );
};

export default Qna;