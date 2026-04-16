// client-side Kakao SDK loader and initializer
export const initKakao = (): Promise<boolean> => {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') return resolve(false);
        const win: any = window as any;
        const key = '8c165b4c60cea49d4eb2376f677fd27d';
        if (!key) {
            resolve(false);
            return;
        }
        if (win.Kakao && win.Kakao.isInitialized && win.Kakao.isInitialized()) {
            resolve(true);
            return;
        }
        if (win.Kakao) {
            try {
                win.Kakao.init(key);
                resolve(true);
            } catch (e) {
                console.error('Kakao init failed', e);
                resolve(false);
            }
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
        script.async = true;
        script.onload = () => {
            try {
                if (win.Kakao && win.Kakao.init) {
                    win.Kakao.init(key);
                }
                resolve(!!(win.Kakao && win.Kakao.isInitialized && win.Kakao.isInitialized()));
            } catch (e) {
                console.error('Kakao load/init error', e);
                resolve(false);
            }
        };
        script.onerror = () => {
            console.error('Failed to load Kakao SDK');
            resolve(false);
        };
        document.head.appendChild(script);
    });
};
