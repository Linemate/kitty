'use client';

import { deleteReview, getMyReviewList, getProgramReview } from 'api';
import Paging from 'components/common/Paging';
import useMobile from 'hooks/useMobile';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/review.scss';
import { popupProps, reviewItemProps } from 'types/types';
import { Button } from '../common/Button';
import { initPopup } from '../Portal/PopupPortal';
import PopupPortal from '../Portal/PopupPortal';
import EditReview from './_Edit';
import { useRouter } from 'next/navigation';
import { t } from "utils/i18n";

interface ReviewClientProps {
  id?: number;
  isMy: boolean;
  size: number;
}

const ReviewItem = ({
  isMy,
  title,
  name,
  score,
  content,
  id,
  programId,
  createdAt,
  handleDelete,
  openModal
}: reviewItemProps & {
  openModal?: (id: number, programId: number, content: string, score: number) => void
  handleDelete?: (id: number, programId: number) => void
}) => {
  return (
    <div className="review_item">
      <div className={`star img_${score}`}></div>
      <div className="txt">
        <div className="review_header">
          <div className='left'>
            <span className={`${isMy ? 'title' : 'username'}`}>
              {isMy ? title : name}
            </span>
            <span className='date'>{createdAt.split(' ')[0]}</span>
          </div>
          {handleDelete && (
            <div className='right only_pc only_my'>
              <Button
                classnames={'lightgray btn_edit'}
                type={'text'}
                text='Edit'
                onclick={() => openModal?.(id, programId, content, score)}
              />
              <Button
                classnames={'lightgray btn_delete'}
                type={'text'}
                text='Delete'
                onclick={() => handleDelete(id, programId)}
              />
            </div>
          )}
        </div>
        <div className="review_body">
          <div className="contents">{content}</div>
        </div>
        {isMy && openModal && handleDelete && (
          <div className='review_footer only_my'>
            <div className="date">{createdAt.split(' ')[0]}</div>
            <div className="btns">
              <Button
                classnames={'lightgray btn_edit'}
                type={'text'}
                text='Edit'
                onclick={() => openModal?.(id, programId, content, score)}
              />
              <Button
                classnames={'lightgray btn_delete'}
                type={'text'}
                text='Delete'
                onclick={() => handleDelete(id, programId)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ReviewClient = ({
  id,
  isMy,
  size = 10
}: ReviewClientProps) => {
  const [reviews, setReviews] = useState<reviewItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const initModal = {
    show: false,
    reviewId: 0,
    programId: 0,
    content: '',
    score: 0
  };
  const [modal, setModal] = useState<{
    show: boolean
    reviewId: number
    programId: number
    content: string
    score: number
  }>(initModal);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const isMobile = useMobile();
  const [popup, setPopup] = useState<popupProps>(initPopup);
  const [deleteConfirmPopup, setDeleteConfirmPopup] = useState<popupProps>(initPopup);
  const router = useRouter();

  // 리뷰 조회
  const loadProgramReviews = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const res = isMy
        ? await getMyReviewList(pageNum, size)
        : await getProgramReview(id?.toString() || '0', size, pageNum);
      const data = res.data;
      setReviews(data.list);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      console.error(t("리뷰 조회 실패:"), err);
    } finally {
      setLoading(false);
    }
  }, [isMy, size, id]);

  // 초기 로드
  useEffect(() => {
    loadProgramReviews(0);
  }, [loadProgramReviews]);

  // 리뷰 편집 창 열기
  const openModal = useCallback((reviewId: number, programId: number, content: string, score: number) => {
    setModal({
      show: true,
      reviewId,
      programId,
      content,
      score
    });
  }, []);

  // 리뷰 삭제    
  const handleDelete = useCallback(async (reviewId: number, programId: number) => {
    setDeleteConfirmPopup({
      show: true,
      children: t("작성한 리뷰를 삭제하시겠습니까?"),
      type: 'confirm',
      yesFunction: async () => {
        try {
          const res = await deleteReview(Number(programId), reviewId);
          if (res && res.code === 200) {
            setDeleteConfirmPopup(initPopup);
            setPopup({
              show: true,
              children: t("리뷰가 삭제되었습니다."),
              type: 'alert',
              closePortal: () => {
                setPopup(initPopup);
                loadProgramReviews(page);
              },
              noText: t("확인"),
            });
          } else {
            setDeleteConfirmPopup(initPopup);
            setPopup({
              show: true,
              children: t("리뷰 삭제에 실패했습니다."),
              type: 'alert',
              closePortal: () => {
                setPopup(initPopup);
              },
              noText: t("확인"),
            });
          }
        } catch (err) {
          console.error(t("리뷰 삭제 실패:"), err);
          setDeleteConfirmPopup(initPopup);
          setPopup({
            show: true,
            children: t("리뷰 삭제에 실패했습니다."),
            type: 'alert',
            closePortal: () => {
              setPopup(initPopup);
            },
            noText: t("확인"),
          });
        }
      },
      yesText: t("확인"),
      closePortal: () => {
        setDeleteConfirmPopup(initPopup);
      },
      noText: t("취소"),
    });
  }, [page, loadProgramReviews]);

  // 새로고침 - 리뷰 목록 다시 로드
  const onSuccess = useCallback(() => {
    loadProgramReviews(page);
  }, [page, loadProgramReviews]);

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum);
    loadProgramReviews(pageNum);
  };

  return (
    <>
      <div className={`review_area ${isMobile ? 'mobile' : ''}`}>
        {loading ? (
          <div className="no_review">{t("로딩 중...")}</div>
        ) : reviews.length > 0 ? (
          reviews.map((el: reviewItemProps) => (
            <ReviewItem
              key={el.id}
              {...el}
              isMy={isMy}
              openModal={(reviewId: number, programId: number, content: string, score: number) =>
                openModal(reviewId, programId, content, score)
              }
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <div className="no_review">{t("등록된 후기가 없습니다.")}</div>
        )}

        <Paging
          totalPages={totalPages}
          page={page}
          changePage={handlePageChange}
        />

        {modal.show && (
          <EditReview
            onSuccess={onSuccess}
            reviewId={modal.reviewId}
            content={modal.content}
            score={modal.score}
            closePortal={() => setModal(initModal)}
            programId={modal.programId}
          />
        )}

        {deleteConfirmPopup.show && (
          <PopupPortal
            show={deleteConfirmPopup.show}
            type={deleteConfirmPopup.type}
            closePortal={deleteConfirmPopup.closePortal}
            yesFunction={deleteConfirmPopup.yesFunction}
            yesText={deleteConfirmPopup.yesText}
            noText={deleteConfirmPopup.noText}
          >
            {deleteConfirmPopup.children}
          </PopupPortal>
        )}

        {popup.show && (
          <PopupPortal
            show={popup.show}
            type={popup.type}
            closePortal={popup.closePortal}
            noText={popup.noText}
          >
            {popup.children}
          </PopupPortal>
        )}
      </div>
    </>
  );
};

export default ReviewClient;