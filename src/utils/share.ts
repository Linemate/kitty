import { programProps } from '@/types/types';

// 공유하기
export const shareProgram = async (str: string, program: programProps, completedShare: any, failedShare: any, customDesc?: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.linemate.kr';
    const url = baseUrl + '/program/' + program.id;
    try {
        if (str === 'kakao') {
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
                                mobileWebUrl: url,
                                webUrl: url,
                            },
                        },
                        buttons: [
                            {
                                title: '라인메이트에서 보기',
                                link: {
                                    mobileWebUrl: url,
                                    webUrl: url
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