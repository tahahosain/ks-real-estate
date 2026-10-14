"use client";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Autoplay } from "swiper/modules";

import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import styles from "./hero.module.css"


export default function HeroSlider() {
const slides = [
  {
    id: 1,
    image: "/img/gal-1.jpeg",
    title: "خانه‌های لوکس",
    description: "بهترین خانه‌های لوکس ایران",
  },
  {
    id: 2,
    image: "/img/gal-2.jpeg",
    title: "ویلاهای ساحلی",
    description: "ویلاهای مدرن کنار دریا",
  },
  {
    id: 3,
    image: "/img/gal-3.jpeg",
    title: "آپارتمان‌های مدرن",
    description: "زندگی مدرن را تجربه کنید",
  },
];


  return (
    <Swiper
  
      navigation={true}
      loop={true}
      className="mySwiper home-slider"
      autoplay={{ delay: 2000 }}
      modules={[Navigation, Autoplay]}>
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className={styles.slide}>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={slide.id === 1}
              sizes="100vw"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
