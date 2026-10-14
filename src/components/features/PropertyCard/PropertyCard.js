"use client"



import Image from "next/image";
import Link from "next/link";

import  useFavorites  from "@/hooks/useFavorites";
import Button from "@/components/ui/button/Button";
import { formatPrice } from "@/utiles/formatPrice";

import PropertyAddress from "./PropertyAddress";
import PropertyTitle from "./PropertyTitle";


import styles from "./PropertyCard.module.css";

export default function PropertyCard({ property }) {
  if (!property) return null;

  const {
    _id,
    title,
    images,
    location,
    transactionType,
    price,
    deposit,
    rent,
  } = property;

  const { toggleFavorite, isFavorite } = useFavorites();

  const id = _id?.toString();
  const favorite = isFavorite(id);

  const imageSrc = images?.[0]?.url?.trim()
    ? images[0].url
    : "/images/property-placeholder.webp";

  const renderPrice = () => {
    if (transactionType === "sale") {
      return (
        <div className={styles.price}>
          {formatPrice(price) === "توافقی"
            ? formatPrice(price)
            : `${formatPrice(price)} تومان`}
        </div>
      );
    }

    if (transactionType === "rent") {
      return (
        <div className={styles.price}>
          <div>
            ودیعه:
            {formatPrice(deposit) === "توافقی"
              ? formatPrice(deposit)
              : `${formatPrice(deposit)} تومان`}
          </div>

          <div>
            اجاره:
            {formatPrice(rent) === "توافقی"
              ? formatPrice(rent)
              : `${formatPrice(rent)} تومان`}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <article className={styles.card}>
      {/* تصویر و علاقه‌مندی */}
      <figure className={styles.imageWrapper}>
        <Image
          src={imageSrc}
          alt={title || "تصویر ملک"}
          fill
          quality={85}
          sizes="(max-width:768px) 100vw, 50vw"
          className={styles.image}
        />

        <button
          type="button"
          className={styles.favoriteButton}
          aria-label={
            favorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
          }
          onClick={(event) => {
            event.stopPropagation();
            toggleFavorite(id);
          }}>
          {favorite ? "♡" : "♥"}
        </button>
      </figure>

      {/* اطلاعات اصلی ملک */}
      <div className={styles.body}>
        <PropertyTitle>{title}</PropertyTitle>

        <strong>{transactionType === "sale" ? "فروش" : "رهن و اجاره"}</strong>

        <PropertyAddress>{location?.address}</PropertyAddress>

        {renderPrice()}

       
      </div>

      {/* فوتر کارت */}
      <div className={styles.footer}>
        {/* {renderPrice()} */}

        <Link href={`/homeDetails/${id}`}>
          <Button>جزئیات ملک</Button>
        </Link>
      </div>
    </article>
  );
}
