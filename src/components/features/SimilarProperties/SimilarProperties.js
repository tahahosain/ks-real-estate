"use client";

import { useEffect, useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import PropertyCard from "@/components/features/PropertyCard/PropertyCard";
import useSimilarEstates from "@/hooks/useSimilarEstates";

import styles from "./SimilarProperties.module.css";

export default function SimilarProperties({ estateId }) {
  const { data, isLoading, isError } = useSimilarEstates(estateId);

  const properties = data?.data ?? [];

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (!swiperRef.current) return;

    const swiper = swiperRef.current;

    if (!prevRef.current || !nextRef.current) return;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;

    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, [properties]);

  if (isLoading) {
    return (
      <section className={styles.similarProperties}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>پیشنهادهای مشابه</span>
          <h2>املاک مشابه</h2>
        </div>

        <p className={styles.loading}>در حال دریافت املاک مشابه...</p>
      </section>
    );
  }

  if (isError || properties.length === 0) {
    return null;
  }

  return (
    <section className={styles.similarProperties}>
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>پیشنهادهای مشابه</span>

        <h2>املاک مشابه</h2>
      </div>

      <div className={styles.sliderWrapper}>
        <Swiper
          modules={[Navigation, Pagination]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          navigation
          pagination={{
            clickable: true,
          }}
          spaceBetween={24}
          slidesPerView={2}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },

            1024: {
              slidesPerView: 3,
            },

            1280: {
              slidesPerView: 4,
            },
          }}
          className={styles.swiper}>
          {properties.map((property) => (
            <SwiperSlide key={property._id} className={styles.slide}>
              <PropertyCard property={property} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          ref={prevRef}
          type="button"
          className={`${styles.navigation} ${styles.previous}`}
          aria-label="ملک قبلی">
          ❮
        </button>

        <button
          ref={nextRef}
          type="button"
          className={`${styles.navigation} ${styles.next}`}
          aria-label="ملک بعدی">
          ❯
        </button>
      </div>
    </section>
  );
}
