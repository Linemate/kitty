import { useEffect } from "react";

const useBodyLock = (lock: boolean) => {
  useEffect(() => {
    if (lock) {
      document.body.style.overflow = "hidden"; // 스크롤 막기
    } else {
      document.body.style.overflow = ""; // 원래대로 복원
    }

    return () => {
      document.body.style.overflow = ""; // 컴포넌트 언마운트 시 원래대로 복원
    };
  }, [lock]);
};

export default useBodyLock;
