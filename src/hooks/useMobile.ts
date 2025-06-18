import { useState, useEffect } from "react";

const useMobile = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null); // 초기값 null

  useEffect(() => {
    const checkScreenSize = () => {
        console.log(window.innerWidth)
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkScreenSize(); // 클라이언트에서 초기화

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [breakpoint]);

  return isMobile;
};

export default useMobile;
