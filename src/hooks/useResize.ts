import React, { useEffect, useState } from 'react';
// windowSize 타입 정의
interface WindowSize {
    width: number | undefined;
    height: number | undefined;
}
const useResize = () => {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: undefined,
        height: undefined
    });

    useEffect(() => {
        // 브라우저 환경에서만 실행되도록 보장
        if (typeof window !== 'undefined') {
            // window size를 업데이트하는 함수
            const handleResize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };
            
            // 이벤트 리스너
            window.addEventListener("resize", handleResize);
            
            handleResize();
            
            //이벤트리스너 제거 그리고 청소
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    return windowSize;

};

export default useResize;