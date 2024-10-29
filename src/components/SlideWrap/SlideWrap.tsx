'use client'
import React, { useMemo, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import 'styles/slideWrap.scss'
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
    /** 자동재생 (속도 설정시 number 타입으로) */
    autoplay?: boolean | number;
    /** 슬라이더 속도 */
    speed?: number;
    /** 반복 여부 */
    loop?: boolean;

    variableWidth?: boolean;
    centerMode?:boolean;
    centerPadding?:string;
}

const SlideWrap = ({
    arrows = false,
    children,
    className,
    slidesToShow = 1,
    autoplay = true,
    speed = 300,
    dots = false,
    loop = true,
    variableWidth, centerMode = false,
  }: sliderProps) => {
    const [currentIdx, setCurrentIdx] = useState<number>(0);
    const settings = useMemo<Settings>(
        () => ({
          dots: dots,
          infinite: false,
          speed: speed,
          slidesToShow: slidesToShow,
          autoplay: Boolean(autoplay),
          autoplaySpeed: typeof autoplay === 'boolean' ? 3000 : autoplay,
          arrows: arrows,
          variableWidth,
          centerMode,
          beforeChange: (_, newIndex) => {
			setCurrentIdx(newIndex);
		},
        }),
        [autoplay, loop, slidesToShow, speed],
    );
    return (
        <>
            <Slider {...settings}>
                {children}
            </Slider>
        </>
    );
};

export default SlideWrap;