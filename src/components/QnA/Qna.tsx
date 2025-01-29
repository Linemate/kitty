import ModalPortal from 'components/Portal/ModalPortal';
import Portal from 'components/Portal/Portal';
import { Button } from 'components/common/Button';
import React, { useState } from 'react';
import 'styles/qna.scss';

type qnaProps = {
    qna:qnaItemProps;
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
        isReply:false,
        date:'2024.01.24. 17:55',
        isSecret: true
    },
    {
        id:2,
        username: 'Rbiits12**',
        isReply:true,
        date:'2024.01.24. 17:55',
        isSecret: false,
        reply_contents:'이벤트 시간은 3시간~4시간으로 상황에 따라서 길어질 수도 있습니다. ',
        reply_date:'2024.01.24. 17:32',
        contents:'모임 소요 시간이 어떻게 되나요?'
    },
]
const QnaItem = (props:qnaProps) => {
    const {id, username, isReply, reply_contents, reply_date, date, isSecret, contents} = props.qna;
    const [openReply, setOpenReply] = useState<boolean>(false);
    const toggleReply = () => {
        setOpenReply(!openReply);
    }
    return (
        <div className={`qna ${isReply ? 'pointer' : ''}`} onClick={toggleReply}>
            <div className='qna_header'>
                {
                    isReply ?
                    <span className='is_reply reply'>미답변</span>
                    :
                    <span className='is_reply no_reply'>답변완료</span>
                }
                <span className='username'>{username}</span>
                <span className='date'>{date}</span>
            </div>
            <div className='qna_body'>
                {
                    isSecret ? 
                    <div className='ico lock'>비밀글입니다.</div>
                    :
                    <div className='contents'>
                        {contents}
                    </div>
                }
                {
                    isReply && openReply && 
                    <div className='reply'>
                        <div className='reply_contents'>{reply_contents}</div>
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
    const viewAsk = () => {
        setModal(true);
    }
    const closePortal = () => {
        setModal(false);
    }
    return (
        <div className='qna_area'>
            <div className='btn_area'>
                <Button classnames='fit border gray' text={'Ask a question'} type='text' onclick={viewAsk} />
            </div>
            <div>
                {
                    data.map((el:qnaItemProps) => <QnaItem qna={el} key={el.id} />)
                }
            </div>
            {
                modal &&
                <Portal>
                    <ModalPortal type={'qna'} title={'문의 작성하기'} closePortal={closePortal}>
                        <div>
                            <div className={`input_textarea`} contentEditable></div>
                            <div className='input_checkbox'>
                                <label>
                                    <input type="checkbox" />
                                    <span className={`ico checkbox`}></span>
                                    <span className='text'>비밀글</span>
                                </label>
                            </div>
                        </div>
                    </ModalPortal>
                </Portal>
            }
        </div>
    );
};

export default Qna;