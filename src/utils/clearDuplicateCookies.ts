import { deleteCookie } from './stores';

export function clearDuplicateCookies() {
    // /program 경로의 USERINFO 삭제
    deleteCookie('USERINFO'); // 이미 path=/로 설정됨
    // 다른 경로의 중복 쿠키가 있다면 추가로 삭제
    document.cookie = 'USERINFO=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/program';
}
