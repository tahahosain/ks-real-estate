



import styles from "./homeSingle.module.css";
import { formatPrice } from "@/utiles/formatPrice";

const propertyTypeLabels = {
  apartment: "آپارتمان",
  villa: "ویلا",
  house: "خانه",
  land: "زمین",
  commercial: "تجاری",
};

const propertyStatusLabels = {
  available: "در دسترس",
  reserved: "رزرو شده",
  sold: "فروخته شده",
  rented: "اجاره داده شده",
};

export default function HomeSingle({ home }) {
  if (!home) return null;

  const {
    _id,
    title,
    price,
    deposit,
    rent,
    transactionType,
    type,
    location,
    images,
    bedrooms,
    bathrooms,
    area,
    yearBuilt,
    description,
    status,
    parking,
    floor,
    totalFloors,
    amenities,
    isFeatured,
    video,
  } = home;

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

  const mainImage = images?.[0];

  return (
    <section className={styles.homeDetails}>
      {/* =========================
          بخش بالایی
      ========================= */}

      <div className={styles.homeDetailsTop}>
        {/* =========================
            تصویر / ویدئو
        ========================= */}

        <div className={styles.homeImg}>
          {video?.url ? (
            <video
              className={styles.video}
              src={video.url}
              poster={video.thumbnail || mainImage?.url}
              controls
              preload="metadata"
            />
          ) : mainImage?.url ? (
            <img src={mainImage.url} alt={mainImage.alt || title} />
          ) : (
            <div className={styles.noImage}>
              تصویری برای این ملک ثبت نشده است.
            </div>
          )}
        </div>

        {/* =========================
            معرفی ملک
        ========================= */}

        <div className={styles.homeIntroduce}>
          {/* عنوان */}

          <div className={styles.homeTitle}>
            <h1>
              <span>{title}</span>

              {renderPrice()}
            </h1>

            {/* Tags */}

            <div className={styles.tags}>
              {isFeatured && (
                <span className={`${styles.tag} ${styles.greenTag}`}>ویژه</span>
              )}

              <span className={`${styles.tag} ${styles.brownTag}`}>
                برای {transactionType === "sale" ? "فروش" : "اجاره"}
              </span>
            </div>

            {/* آدرس */}

            <div className={styles.address}>
              <span>آدرس:</span>

              <span>
                {location?.province}

                {location?.city && `، ${location.city}`}

                {location?.neighborhood && `، ${location.neighborhood}`}

                {location?.address && `، ${location.address}`}
              </span>
            </div>
          </div>

          {/* =========================
              مرور کلی
          ========================= */}

          <div className={styles.homeReview}>
            <div className={styles.homeReviewTop}>
              <h2>مرور کلی</h2>

              <p>
                <span>کد ملک:</span>

                <span>{_id}</span>
              </p>
            </div>

            <ul className={styles.homeReviewBottom}>
              <li>
                <span>نوع ملک:</span>

                <span>{propertyTypeLabels[type] || "نامشخص"}</span>
              </li>

              <li>
                <span>اتاق خواب:</span>

                <span>{bedrooms}</span>
              </li>

              <li>
                <span>حمام:</span>

                <span>{bathrooms}</span>
              </li>

              <li>
                <span>متراژ:</span>

                <span>{area} متر</span>
              </li>

              <li>
                <span>سال ساخت:</span>

                <span>{yearBuilt || "نامشخص"}</span>
              </li>

              <li>
                <span>وضعیت:</span>

                <span>{propertyStatusLabels[status] || "نامشخص"}</span>
              </li>

              <li>
                <span>پارکینگ:</span>

                <span>{parking ? "دارد" : "ندارد"}</span>
              </li>

              {floor !== undefined && (
                <li>
                  <span>طبقه:</span>
                  <span>{floor}</span>
                </li>
              )}

              {totalFloors !== undefined && (
                <li>
                  <span>تعداد طبقات:</span>
                  <span>{totalFloors}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* =========================
          توضیحات
      ========================= */}

      <div className={styles.homeDetailsBottom}>
        <div className={styles.homeDetailsDescription}>
          <h2>توضیحات</h2>

          <p>{description || "توضیحاتی برای این ملک ثبت نشده است."}</p>
        </div>
      </div>

      {/* =========================
          امکانات
      ========================= */}

      {/* <PropertyAmenities amenities={amenities} /> */}
    </section>
  );
}