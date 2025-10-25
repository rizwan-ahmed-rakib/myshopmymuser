import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useAbout} from '../context_or_provider/AboutContext';


// import img1 from "../assetes/slider.jpg";
// import img2 from "../assetes/slider2.jpg";
// import img3 from "../assetes/slider3.jpg";

const Hero = () => {
    const {sliderBanners} = useAbout();

    // react-slick এর settings
    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        arrows: true,
    };

    if (!sliderBanners.length) return <p>Loading banners...</p>;


    return (
        <div className="w-full max-w-7xl mx-auto mt-4 rounded-xl overflow-hidden shadow-lg">
            <Slider {...settings}>
                {/* Slide 1 */}
                {sliderBanners.map((banner) => (

                    <div>
                        <img src={banner.image} alt="Hero 1" className="w-full h-[600px] object-cover"/>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Hero;
