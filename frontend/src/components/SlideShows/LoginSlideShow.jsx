import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

function LoginSlideShow() {
  const slides = [
    {
      src: "/pictures/SlideshowThreeImage.jpg", 
      caption: "Securely manage your finances anytime, anywhere with our trusted banking platform.",
    },
    {
      src: "/pictures/SlideshowImageTwo.jpg", 
      caption: "Your financial security is our priority—experience seamless and secure banking today",
    },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Logo on top-left */}
      <img
        src="/pictures/FamilyBankLogo.png"
        alt="Logo"
        className="absolute  left-5 w-44 h-auto z-10"
      />

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
            <div className="relative w-full h-screen">
            <img
  src={slide.src}
  alt={`Slide ${index + 1}`}
  className="w-full h-full object-cover opacity-80"
/>

              <p className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center text-white text-lg px-4 py-2 bg-opacity-60 bg-black rounded-lg max-w-xl">
                {slide.caption}
              </p>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}

export default LoginSlideShow;
