"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./Gallery.module.css";

function Gallery({ images = [] }) {
    
  const validImages = images.filter(
    (image) => image?.url && image.url.trim() !== "",
  );

  const [selectedImage, setSelectedImage] = useState(0);

  if (!validImages.length) {
    return <p>تصویری برای نمایش وجود ندارد.</p>;
  }

  const currentImage = validImages[selectedImage];

  const nextImage = () => {
    setSelectedImage((current) =>
      current === validImages.length - 1 ? 0 : current + 1,
    );
  };

  const previousImage = () => {
    setSelectedImage((current) =>
      current === 0 ? validImages.length - 1 : current - 1,
    );
  };

  return (
    <section className={styles.gallery}>
      {/* تصویر اصلی */}

      <div className={styles.mainImage}>
        <Image
          src={currentImage.url}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          alt={currentImage.alt || `تصویر ملک ${selectedImage + 1}`}
          priority
        />

        <button
          type="button"
          className={`${styles.arrow} ${styles.previous}`}
          onClick={previousImage}
          aria-label="تصویر قبلی">
          ❮
        </button>

        <button
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          onClick={nextImage}
          aria-label="تصویر بعدی">
          ❯
        </button>
      </div>

      {/* تصاویر بندانگشتی */}

      <div className={styles.thumbnails}>
        {validImages.map((image, index) => (
          <button
            key={image.publicId || image.url || index}
            type="button"
            className={`${styles.thumbnail} ${
              selectedImage === index ? styles.active : ""
            }`}
            onClick={() => setSelectedImage(index)}
            aria-label={`نمایش تصویر ${index + 1}`}>
            <Image
              src={image.url}
              fill
              sizes="(max-width: 768px) 80px, 110px"
              alt={image.alt || `بندانگشتی تصویر ${index + 1}`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
