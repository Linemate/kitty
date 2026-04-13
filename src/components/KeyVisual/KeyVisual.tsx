'use client';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useState } from 'react';
import 'styles/keyVisual.scss'
import { useRouter } from 'next/navigation';
import { bannerProps } from '@/types/types';

interface KeyVisualProps {
    banners: bannerProps[] | null;
}

const KeyVisual = ({ banners }: KeyVisualProps) => {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        swipe: true,
        pauseOnHover: false,
        pauseOnFocus: false,
        afterChange: (current: number) => setCurrentSlide(current),
    };

    return (
        <div className='key_visual_wrapper'>
            {banners && banners.length > 0 ? (
                <div className="slider_container">
                    <Slider {...settings}>
                        {banners.map((banner) => (
                            <div key={banner.id} onClick={() => router.push('')} className="bg slide_bg">
                                <img src={banner.image?.url || ''} alt={`banner ${banner.id}`} />
                            </div>
                        ))}
                    </Slider>
                    <div className="pagination">
                        {currentSlide + 1} / {banners.length}
                    </div>
                </div>
            ) : (
                <div className='bg'></div>
            )}
        </div>
    );
};

export default KeyVisual;