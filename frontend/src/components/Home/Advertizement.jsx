import React from 'react'
import AdverticeLandscape from '../../images/Advertice-landscape.jpeg'

// Import css files Slick Carousel (Slider)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";

const Advertizement = () => {
    var settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        // autoplay:true,
        // autoplaySpeed: 2000,
    };

    return (
        <section className='advertice-section'>
            <div className="container">
                <Slider {...settings}>
                    <div className="image-container">
                        <img src={AdverticeLandscape} alt='advertice' />
                    </div>
                    <div className="image-container">
                        <img src={AdverticeLandscape} alt='advertice' />
                    </div>
                    <div className="image-container">
                        <img src={AdverticeLandscape} alt='advertice' />
                    </div>
                </Slider>
            </div>

        </section >
    )
}

export default Advertizement
