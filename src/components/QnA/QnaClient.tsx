'use client';

import { Button } from 'components/common/Button';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/qna.scss';
import PopupPortal, { initPopup } from 'components/Portal/PopupPortal';
import useMobile from 'hooks/useMobile';
import { popupProps, qnaItemProps, qnaProps } from 'types/types';
import { deleteInquiry, getInquiries, getMyQnaList } from 'api';
import dateTimeOfLanguage from 'utils/dateTimeOfLanguage';
import { useAuthStore, useLanguage } from 'utils/stores';
import { useRouter } from 'next/navigation';
import Paging from 'components/common/Paging';
import AddQna from './_Add';
import { t } from "utils/i18n";

interface QnaClientProps {
  id?: string;
  isMy: boolean;
  size: number;
}

const QnaItem = (props: qnaProps & { 
  isMobile: boolean | null
  handleDelete: (inquiryId: number, programId?: number) => void
  programId?: number
}) => {
  const { qna, isMy, isMobile, language, handleDelete, programId } = props;
  const { id, buddy, title, content, answer, isSecret, createdAt } = qna;
  const [seeMore, setSeeMore] = useState<boolean>(true);

  const handleQnaDelete = () => {
    handleDelete(id, programId);
  };

  const handleSeeMore = () => {
    setSeeMore(false);
  };

  return (
    <div className={`qna_item`}>
      <div className="qna_header">
        <div className="left">
          {answer && answer.id ? (
            <span className="is_reply no_reply">{t("답변완료")}</span>
          ) : (
            <span className="is_reply reply">{t("미답변")}</span>
          )}
          <span className="username">{isMy ? title : buddy?.name || ''}</span>
          <span className="date">
            {isMobile ? createdAt.split(' ')[0] : createdAt}
          </span>
        </div>
        {!answer && qna.isOwner && (
          <div className="right">
            <Button
              classnames={'lightgray btn_delete'}
              type={'text'}
              text={`Delete`}
              onclick={handleQnaDelete}
            />
          </div>
        )}
      </div>
      <div className="qna_body">
        <div className={`${isSecret ? 'ico lock' : ''} qna_contents`}>
          {!content || content === '' ? (
            'Private post.'
          ) : (
            <>
              {seeMore ? content?.substring(0, 200) : content}
              {seeMore && content && content.length >= 200 && '...'}
              {seeMore && content && content.length >= 200 && (
                <div className="see_more_wrap">
                  <Button
                    classnames={'lightgray'}
                    type={'text'}
                    text={`See More`}
                    onclick={handleSeeMore}
                  />
                </div>
              )}
            </>
          )}
        </div>
        {answer && answer.id && (
          <div className="reply">
            <div className="reply_contents">
              {isSecret ? 'Private post.' : answer.contents}
            </div>
            <div className="reply_date">
              {dateTimeOfLanguage(answer.createdAt, language)}
            </div>
          </div>
        )}
      </div>
      <div className="qna_footer only_my">
        <div className="date">{dateTimeOfLanguage(createdAt, language)}</div>
        <Button
          classnames={'lightgray btn_delete'}
          type={'text'}
          text={`Delete`}
          onclick={handleQnaDelete}
        />
      </div>
    </div>
  );
};

const QnaClient = ({ id, isMy, size }: QnaClientProps) => {
  const [modal, setModal] = useState<boolean>(false);
  const [popup, setPopup] = useState<popupProps>(initPopup);
  const [qnas, setQnas] = useState<qnaItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const userInfo = useAuthStore.getState().userInfo;
  const { language } = useLanguage();
  const router = useRouter();
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const isMobile = useMobile();

  // qna 조회
  const loadInquiries = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const res = isMy
        ? await getMyQnaList(pageNum, size)
        : await getInquiries(id || '', size, pageNum);
      const data = res.data;
      const list = data.list;
      setQnas(list);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      console.error(t("Q&A 조회 실패:"), err);
    } finally {
      setLoading(false);
    }
  }, [isMy, id, size]);

  // 초기 로드
  useEffect(() => {
    loadInquiries(0);
  }, [loadInquiries]);

  // qna 삭제
  const handleDelete = useCallback(
    async (inquiryId: number, programId?: number) => {
      const programIdNum = programId ? Number(programId) : Number(id);

      if (!programIdNum || isNaN(programIdNum)) {
        setPopup({
          show: true,
          children: t("프로그램 ID가 없습니다."),
          type: 'alert',
          closePortal: () => {
            setPopup(initPopup);
          },
          noText: t("확인"),
        });
        return;
      }

      setPopup({
        show: true,
        children: t("작성한 문의를 삭제하시겠습니까?"),
        type: 'confirm',
        yesFunction: async () => {
          try {
            const res = await deleteInquiry(programIdNum, inquiryId);
            if (res && res.code === 200) {
              setPopup({
                show: true,
                children: t("문의가 삭제되었습니다."),
                type: 'alert',
                closePortal: () => {
                  setPopup(initPopup);
                  loadInquiries(page);
                },
                noText: t("확인"),
              });
            } else {
              setPopup({
                show: true,
                children: t("문의 삭제에 실패했습니다."),
                type: 'alert',
                closePortal: () => {
                  setPopup(initPopup);
                },
                noText: t("확인"),
              });
            }
          } catch (err) {
            console.error(t("문의 삭제 실패:"), err);
            setPopup({
              show: true,
              children: t("문의 삭제에 실패했습니다."),
              type: 'alert',
              closePortal: () => {
                setPopup(initPopup);
              },
              noText: t("확인"),
            });
          }
        },
        yesText: t("확인"),
        noText: t("취소"),
        closePortal: () => {
          setPopup(initPopup);
        },
      });
    },
    [id, page, loadInquiries]
  );

  const viewAsk = () => {
    if (userInfo) {
      setModal(true);
    } else {
      alert(t("로그인 후 이용해주세요."));
      router.push(
        `/account/login?redirect=${encodeURIComponent(
          window.location.origin + '/program/' + id
        )}`
      );
    }
  };

  const closePortal = () => {
    setModal(false);
  };

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum);
    loadInquiries(pageNum);
  };

  const onSuccess = useCallback(() => {
    loadInquiries(page);
    setModal(false);
  }, [page, loadInquiries]);

  return (
    <div className={`qna_area ${isMobile ? 'mobile' : ''}`}>
      {/* 문의 등록 버튼 */}
      {!isMy && (
        <div className="btn_area">
          <Button
            classnames="fit border lightgray"
            text={'Ask a question'}
            type="text"
            onclick={viewAsk}
          />
        </div>
      )}

      {/* 목록 */}
      <div className="qna_list">
        {loading ? (
          <div className="no_qna">{t("로딩 중...")}</div>
        ) : qnas.length > 0 ? (
          qnas.map((el: qnaItemProps) => (
            <QnaItem
              key={el.id}
              qna={el}
              isMy={isMy}
              isMobile={isMobile}
              language={language}
              handleDelete={handleDelete}
              programId={Number(id)}
            />
          ))
        ) : (
          <div className="no_qna">{t("등록된 문의가 없습니다.")}</div>
        )}
      </div>

      {/* 페이징 */}
      <Paging
        totalPages={totalPages}
        page={page}
        changePage={handlePageChange}
      />

      {/* 문의 등록하기 */}
      {modal && (
        <AddQna id={id || ''} setPopup={setPopup} closePortal={closePortal} onSuccess={onSuccess} />
      )}

      {/* Alert / Confirm 팝업 */}
      {popup.show && (
        <PopupPortal
          type={popup.type}
          closePortal={popup.closePortal}
          noText={popup.noText ? popup.noText : t("취소")}
          yesText={popup.yesText ? popup.yesText : t("확인")}
          yesFunction={popup.yesFunction}
        >
          {popup.children}
        </PopupPortal>
      )}
    </div>
  );
};

export default QnaClient;