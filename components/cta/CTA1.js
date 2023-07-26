"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import ctabg400w from "../../assets/images/cta/first-cta-bg400w.webp";
import cta800w from "../../assets/images/cta/first-cta-800w.webp";
import Link from "next/link";
import config from "../../config";
import "swiper/css";
import "swiper/css/autoplay";

export default function CTA() {
  const [swiper, setSwiper] = useState(null);

  const slides = [
    {
      title: "50+",
      content: "Projects",
      hasStar: false,
    },
    {
      title: "5.0",
      content: "Clutch Reviews",
      hasStar: true,
    },
  ];

  const playSwiper = (play) => {
    if (swiper) {
      play ? swiper.autoplay.start() : swiper.autoplay.stop();
    }
  };

  return (
    <section className="container relative mt-32 xl:mt-44 mb-20 xl:mb-0 font-inter-medium 3xl:px-12">
      <div className="xl:hidden">
        <Image
          src={ctabg400w}
          loading="lazy"
          alt="cta-bg-image"
          className="absolute top-[-6.5rem] sm:left-[4.5rem] md:left-[6.5rem] w-[100%] sm:w-[80%] object-content"
        />
      </div>
      <div className="xl:container xl:flex xl:flex-row">
        <div className="flex flex-col items-center xl:items-start xl:mb-20 xl:w-[60%] 2xl:w-[50%]">
          <p className="text-center xl:text-left text-[1.875rem] md:text-[2.813rem] lg:text-[3.438rem] leading-[2.5rem] md:leading-[3.75rem] lg:leading-[5.156rem] font-inter-bold text-black-core/[0.87]">
            Want to build a new version of your existing app or add new
            features?
          </p>
          <p className="mt-4 text-[1rem] md:text-[1.25rem] leading-[1.5rem] md:leading-[1.875rem] font-inter-medium text-center xl:text-left text-black-core/[0.87] lg:text-black-core/[0.60]">
            Not sure where to start? We also offer code and architecture
            reviews, strategic planning, and more.
          </p>
          <Link
            href={`${config.WEBSITE_URL}/contact`}
            className="relative justify-self-center mt-6 rounded-full border-[1px] border-solid border-transparent bg-gradient-to-r from-[#f2709c] to-[#ff9472] hover:shadow-[inset_2px_1000px_1px_#fff] font-inter-semibold text-white"
          >
            <div className="py-[0.8rem] px-[1.5rem] text-[1.188rem] leading-[1.425rem] md:text-[1.09375rem] md:leading-[1.3125rem] lg:text-[1.1875rem] lg:leading-[1.4375rem] tracking-normal hoverable-text inline-block">
              Talk to our experts
            </div>
          </Link>
        </div>
        <div className="hidden xl:block relative w-[53%] xl:w-[40%] 2xl:w-[50%]">
          <Image
            src={cta800w}
            loading="lazy"
            className="absolute right-0 h-full object-contain z-[2] mr-[-50px]"
            alt="cta-image"
          />

          <div className="swiper-content flex xl:items-center w-full h-full pl-4 md:pl-0">
            <Swiper
              slidesPerView={1}
              spaceBetween={20}
              speed={5000}
              centeredSlides={false}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              modules={[Autoplay]}
              onSwiper={(swiper) => {
                setSwiper(swiper);
              }}
            >
              {slides.map((slide, index) => {
                return (
                  <SwiperSlide
                    key={index}
                    onMouseOver={() => playSwiper(false)}
                    onMouseLeave={() => playSwiper(true)}
                    onTouchStart={() => playSwiper(false)}
                    onTouchMove={() => playSwiper(true)}
                    onTouchEnd={() => playSwiper(true)}
                    className="cursor-pointer"
                  >
                    <div
                      className={`flex flex-col items-center rounded-[16px] bg-gradient-to-r from-[#FF835B]/[0.3] to-[#F2709C]/[0.3] w-[50%] p-[20px] h-[140px] ${
                        slide.hasStar ? "justify-between" : "justify-center"
                      }`}
                    >
                      <span className="font-inter-bold text-[1.5rem] leading-[2.25rem]">
                        {slide.title}
                      </span>
                      <span className="font-inter-medium text-[1.1875rem] leading-[1.78125rem] text-black-core/[0.6]">
                        {slide.content}
                      </span>
                      {slide.hasStar && (
                        <div className="flex justify-between mt-[3px]">
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon
                              key={i}
                              className="fa w-[15px] h-[15px] mr-[5px] text-[#F2709C]"
                              icon={faStar}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
