"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import useApproveEstate from "@/hooks/useApproveEstate";
import useRejectEstate from "@/hooks/useRejectEstate";
import styles from "@/styles/p-admin/PendingPropertyList.module.css";
import Image from "next/image";
import Link from "next/link";
export default function PendingPropertyList({ properties }) {
  const [pendingProperties, setPendingProperties] = useState(properties);

  const { mutate: approveEstate, isPending: isApproving } = useApproveEstate();

  const { mutate: rejectEstate, isPending: isRejecting } = useRejectEstate();

  const handleApprove = (estateId, title) => {
    if (isApproving || isRejecting) return;

    Swal.fire({
      title: "تأیید ملک",
      text: `آیا از تأیید «${title}» اطمینان دارید؟`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "بله، تأیید کن",
      cancelButtonText: "انصراف",
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) return;

      approveEstate(estateId, {
        onSuccess: () => {
          setPendingProperties((prev) =>
            prev.filter((estate) => estate._id !== estateId),
          );

          Swal.fire({
            icon: "success",
            title: "تأیید شد",
            text: "ملک با موفقیت تأیید شد.",
            confirmButtonText: "باشه",
          });
        },

        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "خطا",
            text: error.message || "تأیید ملک انجام نشد.",
            confirmButtonText: "باشه",
          });
        },
      });
    });
  };

  const handleReject = (estateId, title) => {
    if (isApproving || isRejecting) return;

    Swal.fire({
      title: "رد ملک",
      text: `آیا از رد کردن «${title}» اطمینان دارید؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، رد کن",
      cancelButtonText: "انصراف",
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) return;

      rejectEstate(estateId, {
        onSuccess: () => {
          setPendingProperties((prev) =>
            prev.filter((estate) => estate._id !== estateId),
          );

          Swal.fire({
            icon: "success",
            title: "ملک رد شد",
            text: "ملک با موفقیت رد شد.",
            confirmButtonText: "باشه",
          });
        },

        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "خطا",
            text: error.message || "رد ملک انجام نشد.",
            confirmButtonText: "باشه",
          });
        },
      });
    });
  };

  return (
    <div className={styles.list}>
      {pendingProperties.map((estate) => (
        <article key={estate._id} className={styles.card}>
          {/* تصویر */}
          <div className={styles.imageWrapper}>
            <Image
              src={
                estate.thumbnail ||
                estate.images?.[0]?.url ||
                "/images/property-placeholder.webp"
              }
              alt={estate.title}
              fill
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
              className={styles.image}
            />

            <span className={styles.pendingBadge}>در انتظار تأیید</span>
          </div>

          {/* اطلاعات */}
          <div className={styles.body}>
            <h2 className={styles.title}>{estate.title}</h2>

            <p className={styles.address}>
              {estate.location?.province || "استان نامشخص"}
              {"، "}
              {estate.location?.city || "شهر نامشخص"}
            </p>

            <div className={styles.details}>
              <div className={styles.detail}>
                <span>نوع ملک</span>
                <strong>{estate.type || "نامشخص"}</strong>
              </div>

              <div className={styles.detail}>
                <span>نوع معامله</span>
                <strong>
                  {estate.transactionType === "sale" ? "فروش" : "اجاره"}
                </strong>
              </div>

              <div className={styles.detail}>
                <span>متراژ</span>
                <strong>
                  {estate.area
                    ? `${estate.area.toLocaleString("fa-IR")} متر`
                    : "نامشخص"}
                </strong>
              </div>

              <div className={styles.detail}>
                <span>خواب</span>
                <strong>{estate.bedrooms ?? "—"}</strong>
              </div>
            </div>

            {/* قیمت */}
            <div className={styles.price}>
              {estate.transactionType === "sale" ? (
                <>
                  <span>قیمت</span>
                  <strong>
                    {estate.price
                      ? `${estate.price.toLocaleString("fa-IR")} تومان`
                      : "قیمت مشخص نشده"}
                  </strong>
                </>
              ) : (
                <>
                  <span>اجاره</span>
                  <strong>
                    {estate.rent
                      ? `${estate.rent.toLocaleString("fa-IR")} تومان`
                      : "مبلغ مشخص نشده"}
                  </strong>
                </>
              )}
            </div>

            {/* عملیات */}
            <div className={styles.actions}>
              <Link
                href={`/homeDetails/${estate._id}`}
                className={styles.detailsButton}>
                مشاهده جزئیات
              </Link>

              <button
                type="button"
                className={styles.approveButton}
                onClick={() => handleApprove(estate._id, estate.title)}
                disabled={isApproving || isRejecting}>
                {isApproving ? "در حال تأیید..." : "تأیید ملک"}
              </button>

              <button
                type="button"
                className={styles.rejectButton}
                onClick={() => handleReject(estate._id, estate.title)}
                disabled={isApproving || isRejecting}>
                {isRejecting ? "در حال رد..." : "رد ملک"}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
