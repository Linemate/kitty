'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import 'styles/slideWrap.scss';
interface sliderProps {
    /** 슬라이더 좌우 버튼 */
    arrows?: boolean;
    /** 슬라이더 아이템 요소 */
    children: React.ReactNode;
    /** 커스텀 클래스 */
    className?: string;
    /** dots */
    dots?: boolean;
    /** 한번에 보여줄 슬라이드 개수  */
    slidesToShow?: number;
    slidesToScroll?: number;
    /** 자동재생 (속도 설정시 number 타입으로) */
    autoplay?: boolean | number;
    /** 슬라이더 속도 */
    speed?: number;
    /** 반복 여부 */
    loop?: boolean;

    variableWidth?: boolean;
    centerMode?: boolean;
    centerPadding?: string;
    afterChange?: Function;

    /** 슬라이드 몇인지 인디케이터 */
    indicator?: boolean;

    /** 슬라이드 총 몇 개 */
    length?: number;
}

const SlideWrap = ({ arrows = false, children, className, slidesToShow = 1, slidesToScroll = 1, autoplay = true, speed = 300, dots = false, loop = true, variableWidth, centerMode = false, length }: sliderProps) => {
    const sliderRef = useRef<Slider | null>(null);
    const [currentIdx, setCurrentIdx] = useState<number>(0);

    const settings = useMemo<Settings>(
        () => ({
            dots: dots,
            infinite: false,
            speed: speed,
            slidesToShow: slidesToShow,
            slidesToScroll: slidesToScroll,
            autoplay: Boolean(autoplay),
            autoplaySpeed: typeof autoplay === 'boolean' ? 3000 : autoplay,
            arrows: arrows,
            variableWidth,
            centerMode,
            length,
            responsive: [
                {
                    breakpoint: 768, // 모바일 브레이크포인트
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                    },
                },
            ],
        }),
        [arrows, autoplay, centerMode, dots, length, slidesToScroll, slidesToShow, speed, variableWidth]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            if (sliderRef.current) {
                sliderRef.current.slickGoTo(0); // 첫 번째 슬라이드로 이동
            }
        }, 1000); // DOM 렌더링 후 약간의 지연
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Slider ref={sliderRef} {...settings} key={currentIdx}>
                {children}
            </Slider>
        </>
    );
};

export default SlideWrap;
