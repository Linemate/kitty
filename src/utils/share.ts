import { programProps } from '@/types/types';
import { t } from "utils/i18n";

export const updateMetaTags = (program: programProps, url: string, customDesc?: string) => {
    if (typeof document !== 'undefined') {
        const metaTags = [
            { property: 'og:title', content: `${program.title} | 라인메이트` },
            { property: 'og:description', content: customDesc || program.title },
            { property: 'og:image', content: program.thumbnail },
            { property: 'og:url', content: url },
        ];

        metaTags.forEach((tag) => {
            let element = document.querySelector(`meta[property="${tag.property}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('property', tag.property);
                document.head.appendChild(element);
            }
            element.setAttribute('content', tag.content || '');
        });

        if (program.title) {
            document.title = `${program.title} | LINEMATE`;
        }
    }
};

// 공유하기
export const shareProgram = async (str: string, program: programProps, completedShare: any, failedShare: any, customDesc?: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.linemate.kr';
    const url = baseUrl + '/program/' + program.id;

    // meta tag og 적용
    updateMetaTags(program, url, customDesc);

    try {
        if (str === 'kakao') {
            console.log(url)
            const win: any = window as any;
            const { initKakao } = await import('utils/kakao');
            const initialized = await initKakao();
            if (initialized && win.Kakao && win.Kakao.isInitialized && win.Kakao.isInitialized()) {
                try {
                    win.Kakao.Share.sendDefault({
                        objectType: 'feed',
                        content: {
                            title: program.title,
                            description: customDesc || program.title,
                            imageUrl: program.thumbnail,
                            link: {
                                mobileWebUrl: 'https://www.linemate.kr/program/' + program.id,
                                webUrl: 'https://www.linemate.kr/program/' + program.id,
                            },
                        },
                        buttons: [
                            {
                                title: t("라인메이트에서 보기"),
                                link: {
                                    mobileWebUrl: 'https://www.linemate.kr/program/' + program.id,
                                    webUrl: 'https://www.linemate.kr/program/' + program.id
                                },
                            },
                        ],
                    });
                } catch (e) {
                    window.open(url, '_blank');
                }
            } else {
                window.open(url, '_blank');
            }
        } else if (str === 'facebook') {
            console.log(url);
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            window.open(shareUrl, '_blank', 'noopener');
        } else if (str === 'copylink') {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url);
                completedShare();
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                completedShare();
            }
        }
    } catch (err) {
        console.log(err);
        failedShare();
    }
};