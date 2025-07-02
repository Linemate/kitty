import axios from 'axios';
import { loginProps, paymentsProps } from 'types/types';
import { useAuthStore } from 'utils/stores';
const baseURL =  `${process.env.NEXT_PUBLIC_API_HOST}/api/v1`;

// 토큰 없는 axios 인스턴스 (프로그램 상세 등)
const publicApi = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Country': 'KR',
    },
  });
  
  // 토큰 필요한 axios 인스턴스
  const privateApi = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Country': 'KR',
    },
  });
  
  // 요청 인터셉터로 privateApi에만 Authorization 자동 추가
  privateApi.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

// 컬렉션 전체 조회
export const getCollections = async () => {
    const res = await publicApi.get(`/collections`);
    return res.data;
}

// 컬렉션 상세 조회
export const getCollectionDetails = async(id:number) => {
    const res = await publicApi.get(`/collections/${id}`);
    return res.data;
}

// 카테고리 조회
export const getCategories = async() => {
    const res = await publicApi.get(`/categories`);
    return res.data;
}

// 프로그램 전체
export const getPrograms = async () => {
    const res = await publicApi.get(`/programs`);
    return res.data;
}

// 프로그램 상세
export const getProgramDetails = async (id: string) => {
    const res = await publicApi.get(`/programs/${id}`);
    return res.data;
}

// 프로그램 리뷰 조회
export const getProgramReview = async (id:string, pageNum:number) => {
    const res = await publicApi.get(`/programs/${id}/reviews?page=${pageNum}&size=10&sort=id%2Cdesc`);
    return res.data;
}

// 프로그램 예약 스케쥴 확인
export const getProgramSchedules = async (id: string, date:string) => {
    const res = await publicApi.get(`/programs/${id}/reservation/schedules?date=${date}`)
    return res.data;
}

// 프로그램 문의 조회
export const getInquiries = async (id:string, pageNum:number) => {
    const res = await publicApi.get(`/programs/${id}/inquiries`);
    return res.data;
}

// 로그인
export const getLogin = async (values:loginProps) => {
    const res = await publicApi.post(`/account/sign-in`, values);
    return res.data;
}

// 결제
export const requestPayments = async (values:paymentsProps) => {
    const res = await privateApi.post(`/payments/request`, values);
    return res.data;
}

// 결제 성공
export const confirmPayments = async () => {
    const res = await privateApi.post(`/payments/confirm`);
    return res.data;
}