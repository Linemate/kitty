'use client'
export const setCookie = (cookieName: string, value: string, days: number) => {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + days);

    const cookieValue = escape(value) + (days ? `; expires=${exdate.toUTCString()}` : '') + '; path=/'; // 루트 경로로 설정
    if (typeof document !== 'undefined') {
        document.cookie = cookieName + '=' + cookieValue;
    }
};

export const getCookie = (cookieName: string) => {
    let x;
    let y;
    if (typeof document !== 'undefined') {
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
};

export const deleteCookie = (name: string) => {
    if (typeof document !== 'undefined') { 
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    }
};
