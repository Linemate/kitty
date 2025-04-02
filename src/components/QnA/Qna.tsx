import ModalPortal from 'components/Portal/ModalPortal';
import Modal from 'components/Portal/Modal';
import { Button } from 'components/common/Button';
import React, { useRef, useState } from 'react';
import 'styles/qna.scss';
import PopupPortal, { initPopup, popupProps } from 'components/Portal/PopupPortal';
import Popup from 'components/Portal/Popup';

type qnaProps = {
    qna:qnaItemProps;
    handleDelete: Function;
}

type qnaItemProps = {
    id: number;
    username:string;
    isReply:Boolean;
    reply_contents?:string;
    reply_date?:string;
    date:string;
    isSecret:Boolean;
    contents?:string;
}


const data = [
    {
        id:1,
        username: 'Rbiits12**',
        isReply:true,
        date:'2024.01.24. 17:55',
        isSecret: true,
        reply_date:'2024.01.22. 17:32',
    },
    {
        id:2,
        username: 'Rbiits12**',
        isReply:false,
        date:'2024.01.24. 17:55',
        isSecret: false,
        reply_contents:'이벤트 시간은 3시간~4시간으로 상황에 따라서 길어질 수도 있습니다. ',
        reply_date:'2024.01.24. 17:32',
        contents:'모임 소요 시간이 어떻게 되나요?'
    },
    {
        id:3,
        username: 'Rbiits12**',
        isReply: true,
        date:'2024.01.24. 17:55',
        isSecret: false,
        reply_contents:'이벤트 시간은 3시간~4시간으로 상황에 따라서 길어질 수도 있습니다. ',
        reply_date:'2024.01.24. 17:32',
        contents:'모임 소요 시간이 어떻게 되나요? 모임 소요 시간이 어떻게 되나요? 모임 소요 시간이 어떻게 되나요? 모임 소요 시간이 어떻게 되나요? 모임 소요 시간이 어떻게 되나요? 모임 소요 시간이 어떻게 되나요? 모임 소요 시간이 어떻게 되나요? 모임 소요 시간이 어떻게 되나요? 모임 소요 시간이 어떻게 되나요? 모임 소요 시간이 어떻게 되나요? 모임 소요 시간이 어떻게 되나요? 모임 소요 시간이 어떻게 되나요? 모임 소요 시간이 어떻게 되나요? 모임 소요 시간이 어떻게 되나요? 모임 소요 시간이 어떻게 되나요? 모임 소요 시간이 어떻게 되나요?'
    },
]
const QnaItem = (props:qnaProps) => {
    const {qna, handleDelete} = props;
    const {id, username, isReply, reply_contents, reply_date, date, isSecret, contents} = qna;
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
                        isReply ?
                        <span className='is_reply no_reply'>답변완료</span>
                        :
                        <span className='is_reply reply'>미답변</span>
                    }
                    <span className='username'>{username}</span>
                    <span className='date'>{date}</span>
                </div>
                {
                    !isReply &&
                    <div className='right'>
                        <Button classnames={'lightgray'} type={'text'} text={`Delete`} onclick={handleQnaDelete} />
                    </div>
                }
            </div>
            <div className='qna_body'>
                {
                    isSecret ? 
                    <div className='ico lock'>Private post.</div>
                    :
                    <div className='contents'>
                        {
                            seeMore ? contents?.substring(0, 200) : contents
                        }
                        {
                            seeMore && contents && contents.length >= 200 && '...'
                        }
                        {
                            seeMore && contents && contents.length >= 200 &&
                            <div className='see_more_wrap'>
                                <Button classnames={'lightgray'} type={'text'} text={`See More`} onclick={handleSeeMore} />
                            </div>
                        }
                    </div>
                }
                {
                    // 답변
                    isReply && 
                    <div className='reply'>
                        <div className='reply_contents'>
                            {
                                isSecret ? 'Private post.' : reply_contents
                            }
                        </div>
                        <div className='reply_date'>
                            {reply_date}
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

const Qna = () => {
    const [modal, setModal] = useState<boolean>(false);
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [popup, setPopup] = useState<popupProps>(initPopup);
    const [qnaContent, setQnaContent] = useState<string>('');
    const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);

    const inputRef = useRef<HTMLDivElement>(null);
    const viewAsk = () => {
        setModal(true);
    }
    const closePortal = () => {
        setModal(false);
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
        <div className='qna_area'>
            <div className='btn_area'>
                <Button classnames='fit border lightgray' text={'Ask a question'} type='text' onclick={viewAsk} />
            </div>
            <div>
                {
                    data.map((el:qnaItemProps) => <QnaItem qna={el} key={el.id} handleDelete={() => handleDelete(el.id)} />)
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