import { deleteCookie } from './stores';

export function clearDuplicateCookies() {
    // /program 경로의 LOGINTOKEN 삭제
    deleteCookie('LOGINTOKEN'); // 이미 path=/로 설정됨
    // 다른 경로의 중복 쿠키가 있다면 추가로 삭제
    document.cookie = 'LOGINTOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/program';
}
