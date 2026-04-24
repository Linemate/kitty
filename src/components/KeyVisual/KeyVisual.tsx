'use client';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useState } from 'react';
import 'styles/keyVisual.scss'
import useMobile from 'hooks/useMobile';
import { useRouter } from 'next/navigation';
import { bannerProps } from '@/types/types';

interface KeyVisualProps {
    banners: bannerProps[] | null;
}

const KeyVisual = ({ banners }: KeyVisualProps) => {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const isMobile = useMobile();

    const isSingle = !!banners && banners.length <= 1;

    const settings = {
        dots: false,
        infinite: !isSingle,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: !isSingle,
        autoplaySpeed: 3000,
        arrows: false,
        swipe: !isSingle,
        pauseOnHover: false,
        pauseOnFocus: false,
        afterChange: (current: number) => setCurrentSlide(current),
    };

    return (
        <div className={`key_visual_wrapper ${isMobile ? 'mobile' : ''}`}>
            {banners && banners.length > 0 ? (
                <div className="slider_container">
                    <div className="key_visual_text">
                        <h2>DON’T BE A TRAVELER, BE A LOCAL</h2>
                        <p>Let’s share experience together in Linemate❤️</p>
                    </div>
                    <Slider {...settings}>
                        {banners.map((banner) => (
                            <div key={banner.id} onClick={() => router.push('')} className="bg slide_bg">
                                <img src={banner.image?.url || ''} alt={`banner ${banner.id}`} />
                            </div>
                        ))}
                    </Slider>
                    {!isSingle && (
                        <div className="pagination">
                            {currentSlide + 1} / {banners.length}
                        </div>
                    )}
                </div>
            ) : (
                <div className='bg'></div>
            )}
        </div>
    );
};

export default KeyVisual;