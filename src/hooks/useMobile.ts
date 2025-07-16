'use client';
import { useState, useEffect } from 'react';

const useMobile = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const checkScreenSize = () => {
      console.log('width:', window.innerWidth, 'isMobile:', mediaQuery.matches);
      setIsMobile(mediaQuery.matches);
    };

    checkScreenSize();
    mediaQuery.addEventListener('change', checkScreenSize);
    return () => mediaQuery.removeEventListener('change', checkScreenSize);
  }, [breakpoint]);

  return isMobile;
};

export default useMobile;