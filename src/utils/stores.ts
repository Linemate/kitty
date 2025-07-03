import { create } from 'zustand'

interface AuthState {
    token: string | null;
    setToken: (token: string) => void;
    clearToken: () => void;
  }
  
export const useAuthStore = create<AuthState>((set) => ({
token: null,
setToken: (token) => {
    set({ token: token });
    setCookie('LOGINTOKEN', token, 1)
},
clearToken: () => {
    set({ token: null })
    deleteCookie('LOGINTOKEN')
}
}));

interface ResultLanguage {
    language: string;
    setLanguage: (language : string) => void;
}
export const useLanguage = create<ResultLanguage>((set) => ({
    language: 'en',
    setLanguage: (v) => set({
        language: v
    })
}))

export const setCookie = (cookieName:string, value:string, days:number) => {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + days);

    const cookieValue = escape(value) + ((days == null) ? '' : '; expires=' + exdate.toUTCString());
    document.cookie = cookieName + '=' + cookieValue;
  }

export const getCookie = (cookieName:string) => {
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
}

export const deleteCookie = (name:string) => {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}