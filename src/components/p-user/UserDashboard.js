"use client";

import Link from "next/link";
import PropertyCard from "@/components/features/PropertyCard/PropertyCard";
import styles from "@/styles/p-user/UserDashboard.module.css";
const statusLabels = {
  pending: "در انتظار بررسی",
  available: "تأییدشده",
  rejected: "ردشده",
  reserved: "رزروشده",
  sold: "فروخته‌شده",
  rented: "اجاره‌رفته",
};
export default function UserDashboard({ user, properties, submittedProperties = [] }) {
  return (
    <main className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1>داشبورد کاربری</h1>
          <p>خوش آمدید {user?.name || user?.phone}</p>
        </div>

        <Link href="/homeDetails" className={styles.backButton}>
          مشاهده املاک
        </Link>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>علاقه‌مندی‌های من</h2>

          <span>{properties.length} ملک</span>
        </div>

        {properties.length === 0 ? (
          <div className={styles.empty}>
            <h3>هنوز ملکی به علاقه‌مندی‌ها اضافه نکرده‌اید</h3>

            <p>املاک مورد علاقه خود را انتخاب کنید تا اینجا نمایش داده شوند.</p>

            <Link href="/houses">مشاهده املاک</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>املاک ثبت‌شده من</h2>
          <span>{submittedProperties.length.toLocaleString("fa-IR")} ملک</span>
        </div>

        {submittedProperties.length === 0 ? (
          <div className={styles.empty}>
            <h3>هنوز ملکی ثبت نکرده‌اید</h3>
            <p>
              املاک ثبت‌شده توسط شما پس از ثبت درخواست در این بخش نمایش داده
              می‌شوند.
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {submittedProperties.map((estate) => (
              <article key={estate._id} className={styles.submittedCard}>
                <h3>{estate.title}</h3>

                <p>شهر: {estate.location?.city || "نامشخص"}</p>

                <p>
                  متراژ:{" "}
                  {estate.area
                    ? `${estate.area.toLocaleString("fa-IR")} متر`
                    : "نامشخص"}
                </p>

                <div className={styles.statusRow}>
                  <span>وضعیت درخواست:</span>

                  <strong
                    className={`${styles.statusBadge} ${
                      styles[`status_${estate.status}`] || ""
                    }`}>
                    {statusLabels[estate.status] || "نامشخص"}
                  </strong>
                </div>

                <Link
                  href={`/homeDetails/${estate._id}`}
                  className={styles.detailsLink}>
                  مشاهده جزئیات
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
