import { userInfoProps } from 'types/types';
import { create } from 'zustand';
import { deleteCookie, getCookie, setCookie } from './cookiesFunction';

interface AuthState {
    userInfo: userInfoProps | null;
    setUserInfo: (userInfo: userInfoProps) => void;
    clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
    const user = getCookie('USERINFO');
    const userInfoFromCookie = user ? JSON.parse(user) as userInfoProps : null;

    console.log(userInfoFromCookie);
    return {
        userInfo: userInfoFromCookie,
        setUserInfo: (userInfo) => {
            set({ userInfo });
            setCookie('USERINFO', JSON.stringify(userInfo) || '', 1);
        },
        clearToken: () => {
            set({ userInfo: null });
            deleteCookie('USERINFO');
        },
    };
});

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
