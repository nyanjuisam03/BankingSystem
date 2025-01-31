import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import FirstImage from "../../pictures/FirstImage.svg";
import SecondImage from "../../pictures/SecondImage.svg";

function LoginSlideShow() {
  const slides = [
    {
      src: FirstImage, 
      caption: "Securely manage your finances anytime, anywhere with our trusted online banking platform.",
    },
    {
      src: SecondImage, 
      caption: "Your financial security is our priority—experience seamless and secure banking today",
    },
  ];

  return (
    <div className="max-w-lg mx-auto h-screen items-center p-10">
      <h2 className="text-center py-5 font-bold text-xl w-full">Online Bank Management System</h2>
      <Splide
        options={{
          type: "fade",
          rewind: true,
          autoplay: true,
          interval: 3000,
          pauseOnHover: true,
          arrows: false,
          pagination: true,
        }}
      >
        {slides.map((slide, index) => (
          <SplideSlide key={index}>
            <div className="flex flex-col items-center">
              <img
                src={slide.src}
                alt={`Slide ${index + 1}`}
                className="w-full "
              />
              <p className="mt-2 text-center text-gray-700 py-7">{slide.caption}</p>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}

export default LoginSlideShow;
