import { userInfoProps } from 'types/types';
import { create } from 'zustand';

interface AuthState {
    userInfo: userInfoProps | null;
    setUserInfo: (userInfo: userInfoProps) => void;
    clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    userInfo: null,
    setUserInfo: (userInfo) => {
        set({ userInfo: userInfo });
        setCookie('LOGINTOKEN', userInfo?.token || '', 1);
    },
    clearToken: () => {
        set({ userInfo: null });
        deleteCookie('LOGINTOKEN');
    },
}));

interface ResultLanguage {
    language: string;
    setLanguage: (language: string) => void;
}
export const useLanguage = create<ResultLanguage>((set) => ({
    language: 'en',
    setLanguage: (v) =>
        set({
            language: v,
        }),
}));

export const setCookie = (cookieName: string, value: string, days: number) => {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + days);

    const cookieValue = escape(value) + (days ? `; expires=${exdate.toUTCString()}` : '') + '; path=/'; // 루트 경로로 설정
    document.cookie = cookieName + '=' + cookieValue;
};

export const getCookie = (cookieName: string) => {
    let x;
    let y;
    const val = document.cookie.split(';');
    for (let i = 0; i < val.length; i++) {
        x = val[i].substr(0, val[i].indexOf('='));
        y = val[i].substr(val[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, '');
        // 앞과 뒤의 공백 제거하기
        if (x === cookieName) {
            return unescape(y);
        }
    }
};

export const deleteCookie = (name: string) => {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
};
