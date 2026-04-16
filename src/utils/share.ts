import { programProps } from '@/types/types';

// 공유하기
export const shareProgram = async (str: string, program: programProps, completedShare: any, failedShare: any, customDesc?: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.linemate.kr';
    const url = baseUrl + '/program/' + program.id;
    try {
        if (str === 'kakao') {
            console.log(url)
            const win: any = window as any;
            const { initKakao } = await import('utils/kakao');
            const initialized = await initKakao();
            if (initialized && win.Kakao && win.Kakao.isInitialized && win.Kakao.isInitialized()) {
                try {
                    // Kakao.init('이 부분에 있는 키가 JAVASCRIPT 키가 맞는지 다시 한 번만 봐주세요!');

                    win.Kakao.Share.sendDefault({
                        objectType: 'feed',
                        content: {
                            title: '도메인 테스트',
                            description: '버튼아 나와라',
                            imageUrl: 'https://k.kakaocdn.net/dn/bLi3QS/dJMb9bv3Ngg/07lwO1kANN5ZeCkNUmUpf1/kakaolink40_original.jpg',
                            link: {
                                mobileWebUrl: 'https://www.linemate.kr',
                                webUrl: 'https://www.linemate.kr',
                            },
                        },
                        buttons: [
                            {
                                title: '테스트 버튼',
                                link: {
                                    // 이 주소가 콘솔에 등록된 주소와 토씨 하나 안 틀리고 똑같아야 함
                                    mobileWebUrl: 'https://www.linemate.kr',
                                    webUrl: 'https://www.linemate.kr'
                                },
                            },
                        ],
                    });
                    // win.Kakao.Share.sendDefault({
                    //     objectType: 'feed',
                    //     content: {
                    //         title: program.title,
                    //         description: customDesc || program.title,
                    //         imageUrl: program.thumbnail,
                    //         link: {
                    //             mobileWebUrl: 'https://www.linemate.kr/program/' + program.id,
                    //             webUrl: 'https://www.linemate.kr/program/' + program.id,
                    //         },
                    //     },
                    //     buttons: [
                    //         {
                    //             title: '라인메이트에서 보기',
                    //             link: {
                    //                 mobileWebUrl: 'https://www.linemate.kr/program/' + program.id,
                    //                 webUrl: 'https://www.linemate.kr/program/' + program.id
                    //             },
                    //         },
                    //     ],
                    // });
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