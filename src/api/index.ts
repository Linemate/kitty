import axios from 'axios';
import { addReviewBodyProps, addReviewProps, buddyProfileProps, cancelProps, inquiryProps, loginProps, paymentsConfirmProps, paymentsProps } from 'types/types';
import { getCookie, deleteCookie } from 'utils/cookiesFunction';

const baseURL = `${process.env.NEXT_PUBLIC_API_HOST}/api/v1`;

// 토큰 없는 axios 인스턴스 (프로그램 상세 등)
const publicApi = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        country: 'KR',
    },
});

// 토큰 필요한 axios 인스턴스
const privateApi = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        country: 'KR',
    },
});

// 클라이언트 환경에서만 요청 인터셉터 추가
if (typeof window !== 'undefined') {
    privateApi.interceptors.request.use(
        (config) => {
            const user = getCookie('USERINFO');
            if (user) {
                try {
                    const token = JSON.parse(user).token;
                    config.headers.Authorization = `Bearer ${token}`;
                } catch (err) {
                    console.error('토큰 파싱 실패:', err);
                }
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
}

// 응답 인터셉터: 401 발생 시 로그인 페이지로 이동
privateApi.interceptors.response.use(
    (response) => response,
    (error) => {
        try {
            const status = error?.response?.status;
            if (status === 401) {
                if (typeof window !== 'undefined') {
                    deleteCookie('USERINFO');
                    const redirect = encodeURIComponent(window.location.href);
                    window.location.href = `/login?redirect=${redirect}`;
                }
            }
        } catch (e) {
            console.error('Error in response interceptor', e);
        }
        return Promise.reject(error);
    }
);

publicApi.interceptors.response.use(
    (response) => response,
    (error) => {
        try {
            const status = error?.response?.status;
            if (status === 401) {
                if (typeof window !== 'undefined') {
                    deleteCookie('USERINFO');
                    const redirect = encodeURIComponent(window.location.href);
                    window.location.href = `/login?redirect=${redirect}`;
                }
            }
        } catch (e) {
            console.error('Error in publicApi response interceptor', e);
        }
        return Promise.reject(error);
    }
);

// 컬렉션 전체 조회
export const getCollections = async () => {
    const res = await privateApi.get(`/collections`);
    return res.data;
};

// 컬렉션 상세 조회
export const getCollectionDetails = async (id: number) => {
    const res = await publicApi.get(`/collections/${id}`);
    return res.data;
};

// 카테고리 조회
export const getCategories = async () => {
    const res = await publicApi.get(`/categories`);
    return res.data;
};

// 프로그램 전체
export const getPrograms = async () => {
    const res = await publicApi.get(`/programs`);
    return res.data;
};

// 프로그램 상세
export const getProgramDetails = async (id: string) => {
    const res = await privateApi.get(`/programs/${id}`);
    return res.data;
};

// 서버/클라이언트 공용: 토큰 선택적 부여로 privateApi 호출
export const getProgramDetailsWithToken = async (id: string, token?: string) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        country: 'KR',
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const res = await privateApi.get(`/programs/${id}`, { headers });
    return res.data;
};

// 프로그램 리뷰 조회
export const getProgramReview = async (id: string, size: number, page: number) => {
    const res = await publicApi.get(`/programs/${id}/reviews?page=${page}&size=${size}&sort=id%2Cdesc`);
    return res.data;
};

// 프로그램 예약 스케쥴 확인
export const getProgramSchedules = async (id: string, date: string) => {
    const res = await publicApi.get(`/programs/${id}/reservation/schedules?date=${date}`);
    return res.data;
};

// 로그인
export const getLogin = async (values: loginProps) => {
    const res = await publicApi.post(`/account/sign-in`, values);
    return res.data;
};

// 결제
export const requestPayments = async (values: paymentsProps) => {
    const res = await privateApi.post(`/payments/request`, values);
    return res.data;
};

// 나이스페이먼츠 결제 완료 콜백
export const getNicePayCallback = async () => {
    const res = await privateApi.post(`/payments/nice/callback`);
    return res.data;
};

// 결제 승인
export const confirmPayments = async (values: paymentsConfirmProps) => {
    const res = await privateApi.post(`/payments/confirm?provider=NICE`, values);
    return res.data;
};

// 프로그램 문의 조회
export const getInquiries = async (id: string, size: number, page: number) => {
    const res = await privateApi.get(`/programs/${id}/inquiries?page=${page}&size=${size}&sort=id%2Cdesc`);
    return res.data;
};

// 프로그램 문의하기
export const postInquiry = async (id: string, values: inquiryProps) => {
    const res = await privateApi.post(`/programs/${id}/inquiry`, values);
    return res.data;
};

// 프로그램 문의 삭제하기
export const deleteInquiry = async (id: number, inquiryId: number) => {
    const res = await privateApi.delete(`/programs/${id}/inquiry`, { data: { inquiryId } });
    return res.data;
};

// 프로그램 좋아요
export const postProgramLike = async (id: number) => {
    const res = await privateApi.put(`/programs/like/${id}`);
    return res.data;
};

// 토큰 재발급
export const refreshToken = async (buddyId: number, refreshToken: string) => {
    const res = await privateApi.post(`/auth/refresh`, { buddyId, refreshToken });
    return res.data;
};

// 예약 취소 사유 리스트 조회
export const getCancelReasons = async (id: number, reservationId: number) => {
    const res = await publicApi.get(`/programs/${id}/reservation/${reservationId}/cancel-reasons`);
    return res.data;
};

// 프로그램 예약 취소
export const postCancelReason = async (values: cancelProps) => {
    const res = await privateApi.delete(`/programs/${values.programId}/reservation/${values.reservationId}/cancel`, { data: { reasonCodeId: values.reason.reasonCodeId, reasonDetail: values.reason.reasonDetail } });
    return res.data;
};

// 프로그램 신청내역 집계 조회
export const getReservationHistoryCount = async () => {
    const res = await privateApi.get(`/buddy/programs/enrolled/summary`);
    return res.data;
};

// 프로그램 신청내역 조회
export const getReservationHistory = async (pageNum: number, size: number, status: string) => {
    const res = await privateApi.get(`/buddy/programs/enrolled?page=${pageNum}&size=${size}&sort=id%2Casc&status=${status}`);
    return res.data;
};

// 버디 상세조회
export const getBuddyDetails = async (buddyId: number) => {
    const res = await privateApi.get(`/buddy/${buddyId}`);
    return res.data;
};

// 버디 프로필 수정
export const putBuddyProfile = async (buddyId: number, values: buddyProfileProps) => {
    const res = await privateApi.put(`/buddy/${buddyId}`, values);
    return res.data;
};

// 프로그램 예약 정보 조회
export const getReservationInfo = async (id: number, reservationId: number) => {
    const res = await privateApi.get(`/programs/${id}/reservation/${reservationId}`);
    return res.data;
};

// 프로그램 숨김 정보 조회
export const getReservationHiddenInfo = async (id: number, reservationId: number) => {
    const res = await privateApi.get(`/programs/${id}/reservation/${reservationId}/hidden`);
    return res.data;
};

// 결제 내역 목록 조회
export const getPaymentHistory = async (pageNum: number, size: number, status: string) => {
    const res = await privateApi.get(`/payments?page=${pageNum}&size=${size}&sort=id%2Cdesc&status=${status}`);
    return res.data;
};

// 결제 상세 조회
export const getPaymentHistoryDetails = async (paymentsHistoryId: number) => {
    const res = await privateApi.get(`/payments/${paymentsHistoryId}`);
    return res.data;
};

// 공지사항 전체 조회
export const getNoticeList = async (pageNum: number, size: number) => {
    const res = await privateApi.get(`/notices?page=${pageNum}&size=${size}&sort=id%2Cdesc`);
    return res.data;
};

// 공지사항 상세 조회
export const getNoticeDetails = async (id: number) => {
    const res = await privateApi.get(`/notices/${id}`);
    return res.data;
};

// 내가 쓴 리뷰들 조회
export const getMyReviewList = async (pageNum: number, size: number) => {
    const res = await privateApi.get(`/programs/reviews/my?page=${pageNum}&size=${size}&sort=id%2Cdesc`);
    return res.data;
};

// 프로그램 리뷰 작성
export const postReview = async (id: string, data: addReviewBodyProps) => {
    const res = await privateApi.post(`/programs/${id}/review`, data);
    return res.data;
};

// 프로그램 리뷰 수정
export const putReview = async (programId: number, data: addReviewProps) => {
    const res = await privateApi.put(`/programs/${programId}/review`, data);
    return res.data;
};

// 프로그램 리뷰 삭제
export const deleteReview = async (programId: number, reviewId: number) => {
    const res = await privateApi.delete(`/programs/${programId}/review`, { data: { reviewId } });
    return res.data;
};

// 내가 쓴 Q&A들 조회
export const getMyQnaList = async (pageNum: number, size: number) => {
    const res = await privateApi.get(`/programs/inquiries/my?page=${pageNum}&size=${size}&sort=id%2Cdesc`);
    return res.data;
};