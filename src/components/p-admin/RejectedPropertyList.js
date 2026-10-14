"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import useReconsiderEstate from "@/hooks/useReconsiderEstate";
import styles from "@/styles/p-admin/rejected.module.css";

export default function RejectedPropertyList({ properties }) {
  const [rejectedProperties, setRejectedProperties] = useState(properties);

  const { mutateAsync: reconsiderEstate, isPending } = useReconsiderEstate();

  const handleReconsider = async (estate) => {
    const result = await Swal.fire({
      title: "بررسی مجدد ملک",
      text: `آیا می‌خواهید ملک «${estate.title}» دوباره بررسی شود؟`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "بله، بررسی مجدد",
      cancelButtonText: "انصراف",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await reconsiderEstate(estate._id);

      setRejectedProperties((current) =>
        current.filter((item) => item._id !== estate._id),
      );

      await Swal.fire({
        icon: "success",
        title: "انجام شد",
        text: "ملک به صف انتظار تأیید بازگشت.",
        confirmButtonText: "متوجه شدم",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "خطا",
        text: error.message || "بازگرداندن ملک به صف بررسی انجام نشد.",
        confirmButtonText: "باشه",
      });
    }
  };

  if (rejectedProperties.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2>ملکی وجود ندارد</h2>
        <p>در حال حاضر هیچ ملکی در وضعیت ردشده قرار ندارد.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {rejectedProperties.map((estate) => (
        <article key={estate._id} className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.rejectedBadge}>رد شده</span>

            <span className={styles.estateId}>
              شناسه: {estate._id.slice(-6)}
            </span>
          </div>

          <h2>{estate.title}</h2>

          <p>شهر: {estate.location?.city || "نامشخص"}</p>

          <p>
            نوع معامله: {estate.transactionType === "sale" ? "فروش" : "اجاره"}
          </p>

          <p>
            متراژ:{" "}
            {estate.area
              ? `${estate.area.toLocaleString("fa-IR")} متر`
              : "نامشخص"}
          </p>

          <div className={styles.actions}>
            <Link
              href={`/homeDetails/${estate._id}`}
              className={styles.detailsButton}>
              مشاهده جزئیات
            </Link>

            <button
              type="button"
              className={styles.reconsiderButton}
              onClick={() => handleReconsider(estate)}
              disabled={isPending}>
              {isPending ? "در حال انجام..." : "بررسی مجدد"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
