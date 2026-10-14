// import React from "react";
// import styles from "./homeSingle.module.css";

// export default function HomeSingle({ home }) {
//   if (!home) {
//     return null;
//   }

//   const {
//     id,
//     title,
//     price,
//     transactionType,
//     type,
//     location,
//     images,
//     bedrooms,
//     area,
//     yearBuilt,
//     description,
//     status,
//     isFeatured,
//   } = home;
// const propertyTypeLabels = {
//   apartment: "آپارتمان",
//   villa: "ویلا",
//   house: "خانه",
//   land: "زمین",
//   office: "دفتر",
//   shop: "مغازه",
//   };
//   const propertyStatusLables = {
//     available: "در دسترس",
//     rented: "اجاره داده شد",
//     saled:"فروش رفت"
//   };
//   const mainImage = images?.[0];

//   return (
//     <div className={styles.homeDetails}>
//       {/* بخش بالایی */}
//       <div className={styles.homeDetailsTop}>
//         {/* تصویر */}
//         <div className={styles.homeImg}>
//           {mainImage && (
//             <img src={mainImage.url} alt={mainImage.alt || title} />
//           )}
//         </div>

//         {/* معرفی ملک */}
//         <div className={styles.homeIntroduce}>
//           <div className={styles.homeTitle}>
//             <h1>
//               <span>{title}</span>

//               <span>{price?.toLocaleString("fa-IR")} تومان</span>
//             </h1>

//             <div className={styles.tags}>
//               {isFeatured && (
//                 <span className={`${styles.tag} ${styles.greenTag}`}>ویژه</span>
//               )}

//               <span className={`${styles.tag} ${styles.brownTag}`}>
//                 برای {transactionType === "sale" ? "فروش" : "اجاره"}
//               </span>
//             </div>

//             <div className={styles.address}>آدرس: {location?.address}</div>
//           </div>

//           {/* مرور کلی */}
//           <div className={styles.homeReview}>
//             <div className={styles.homeReviewTop}>
//               <h2>مرور کلی</h2>

//               <p>
//                 <span>کد ملک: </span>
//                 <span>{id}</span>
//               </p>
//             </div>

//             <ul className={styles.homeReviewBottom}>
//               <li>
//                 <span>نوع ملک:</span>
//                 <span>{propertyTypeLabels[type]}</span>
//               </li>

//               <li>
//                 <span>اتاق:</span>
//                 <span>{bedrooms}</span>
//               </li>

//               <li>
//                 <span>متراژ:</span>
//                 <span>{area} متر</span>
//               </li>

//               <li>
//                 <span>سال ساخت:</span>
//                 <span>{yearBuilt}</span>
//               </li>

//               <li>
//                 <span>وضعیت:</span>
//                 <span>{propertyStatusLables[status]}</span>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* توضیحات */}
//       <div className={styles.homeDetailsBottom}>
//         <div className={styles.homeDetailsDescription}>
//           <p>توضیحات</p>

//           <p>{description || "توضیحاتی برای این ملک ثبت نشده است."}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
////////////////////
// import styles from "./homeSingle.module.css";
// import { formatPrice } from "@/utiles/formatPrice";

// export default function HomeSingle({ home }) {
//   if (!home) return null;

//   const {
//     title,
//     price,
//     transactionType,
//     type,
//     status,
//     location,
//     area,
//     bedrooms,
//     bathrooms,
//     parking,
//     floor,
//     totalFloors,
//     yearBuilt,
//     amenities,
//     description,
//     _id,
//   } = home;

//   return (
//     <div className={styles.homeDetails}>
//       {/* =========================
//           TOP
//       ========================= */}

//       <div className={styles.homeDetailsTop}>
//         {/* اطلاعات ملک */}

//         <div className={styles.homeIntroduce}>
//           {/* عنوان و قیمت */}

//           <div className={styles.homeTitle}>
//             <h1>
//               <span>{title}</span>

//               <span>
//                 {transactionType === "sale"
//                   ? `${formatPrice(price)} تومان`
//                   : `${formatPrice(price)} تومان`}
//               </span>
//             </h1>

//             {/* Tags */}

//             <div className={styles.tags}>
//               <span className={`${styles.tag} ${styles.greenTag}`}>
//                 {status === "available" ? "موجود" : status}
//               </span>

//               <span className={`${styles.tag} ${styles.brownTag}`}>
//                 برای {transactionType === "sale" ? "فروش" : "اجاره"}
//               </span>
//             </div>

//             {/* آدرس */}

//             <div className={styles.address}>
//               <span>آدرس:</span>

//               <span>
//                 {location?.province}، {location?.city}
//                 {location?.neighborhood && `، ${location.neighborhood}`}،{" "}
//                 {location?.address}
//               </span>
//             </div>
//           </div>

//           {/* =========================
//               OVERVIEW
//           ========================= */}

//           <div className={styles.homeReview}>
//             <div className={styles.homeReviewTop}>
//               <h2>مرور کلی</h2>

//               <p>
//                 <span>کد ملک:</span>

//                 <span>{_id}</span>
//               </p>
//             </div>

//             <ul className={styles.homeReviewBottom}>
//               <li>
//                 <span>نوع ملک:</span>
//                 <span>{getPropertyType(type)}</span>
//               </li>

//               <li>
//                 <span>اتاق خواب:</span>
//                 <span>{bedrooms}</span>
//               </li>

//               <li>
//                 <span>حمام:</span>
//                 <span>{bathrooms}</span>
//               </li>

//               <li>
//                 <span>متراژ:</span>
//                 <span>{area} متر</span>
//               </li>

//               <li>
//                 <span>سال ساخت:</span>
//                 <span>{yearBuilt || "نامشخص"}</span>
//               </li>

//               <li>
//                 <span>پارکینگ:</span>
//                 <span>{parking ? "دارد" : "ندارد"}</span>
//               </li>

//               {floor !== undefined && (
//                 <li>
//                   <span>طبقه:</span>
//                   <span>{floor}</span>
//                 </li>
//               )}

//               {totalFloors !== undefined && (
//                 <li>
//                   <span>تعداد طبقات:</span>
//                   <span>{totalFloors}</span>
//                 </li>
//               )}
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* =========================
//           DESCRIPTION
//       ========================= */}

//       <div className={styles.homeDetailsBottom}>
//         <div className={styles.homeDetailsDescription}>
//           <h2>توضیحات ملک</h2>

//           <p>{description}</p>
//         </div>
//       </div>

//       {/* =========================
//           AMENITIES
//       ========================= */}

//       <div className={styles.amenities}>
//         <h2>امکانات</h2>

//         <ul>
//           {amenities?.elevator && <li>آسانسور</li>}

//           {amenities?.balcony && <li>بالکن</li>}

//           {amenities?.storage && <li>انباری</li>}

//           {amenities?.furnished && <li>مبله</li>}

//           {amenities?.centralHeating && <li>سیستم گرمایش مرکزی</li>}

//           {amenities?.airConditioning && <li>سیستم تهویه مطبوع</li>}
//         </ul>
//       </div>
//     </div>
//   );
// }

/* =========================
   Helpers
========================= */

// function getPropertyType(type) {
//   const types = {
//     apartment: "آپارتمان",
//     villa: "ویلا",
//     house: "خانه",
//     land: "زمین",
//     commercial: "تجاری",
//   };

//   return types[type] || "نامشخص";
// }
///////////////////////////////////////////

////////////////////////////

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
100000000
              {/* <PropertyPrice
                transactionType={transactionType}
                price={price}
                deposit={deposit}
                rent={rent}
              /> */}
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