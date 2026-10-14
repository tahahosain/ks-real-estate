
import { redirect } from "next/navigation";
import Link from "next/link";
import { authAdmin } from "@/utiles/auth-server";
import { getAdminDashboardData } from "@/utiles/dashboard/AdminDashboard";
import StatBlock from "@/components/p-admin/StatBlock";

import styles from "@/styles/p-admin/dashboard.module.css";

export default async function AdminDashboardPage({mode}) {
  const admin = await authAdmin();


  if (!admin) {
    redirect("/login-register");
  }

  const { stats, latestEstates } =
    await getAdminDashboardData();

  return (
    <section className={styles.dashboard}>
      {/* Page intro */}

      <div className={styles.intro}>
        <div>
          <span className={styles.eyebrow}>مرکز عملیات</span>

          <h2 className={styles.heading}>امروز در املاک شما</h2>

          <p className={styles.description}>
            وضعیت کلی املاک و فعالیت‌های پنل را از اینجا مشاهده و مدیریت کنید.
          </p>
        </div>

        <div className={styles.welcome}>
          <span>مدیر سیستم</span>

          <strong>{admin.name || "مدیر املاک"}</strong>
        </div>
      </div>

      {/* Main stats */}

      <div className={styles.statsGrid}>
        <StatBlock
          title="کل املاک"
          value={stats.totalEstates}
          description="تمام املاک ثبت شده"
          variant="primary"
          icon={
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8">
              <path d="M3 21h18" />
              <path d="M5 21V9l7-5 7 5v12" />
              <path d="M9 21v-5h6v5" />
            </svg>
          }
        />

        <StatBlock
          title="املاک قابل معامله"
          value={stats.availableEstates}
          description="در حال حاضر فعال"
          variant="accent"
          icon={
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          }
        />

        <StatBlock
          title="املاک رزرو شده"
          value={stats.reservedEstates}
          description="منتظر تعیین تکلیف"
          icon={
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          }
        />

        <StatBlock
          title="بازدید کل"
          value={stats.totalViews}
          description="مجموع بازدید املاک"
          icon={
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8">
              <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
        />
      </div>

      {/* Secondary information */}

      <div className={styles.secondaryGrid}>
        <div className={styles.statusPanel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelEyebrow}>وضعیت</span>

              <h3>وضعیت فعلی املاک</h3>
            </div>
          </div>

          <div className={styles.statusList}>
            <StatusRow label="قابل معامله" value={stats.availableEstates} />

            <StatusRow label="رزرو شده" value={stats.reservedEstates} />

            <StatusRow label="فروخته شده" value={stats.soldEstates} />

            <StatusRow label="اجاره داده شده" value={stats.rentedEstates} />

            <StatusRow label="املاک ویژه" value={stats.featuredEstates} />
          </div>
        </div>

        <div className={styles.usersPanel}>
          <span className={styles.panelEyebrow}>کاربران</span>

          <h3>جامعه کاربران</h3>

          <strong className={styles.userCount}>
            {stats.totalUsers.toLocaleString("fa-IR")}
          </strong>

          <p>تعداد کل کاربران ثبت شده در سیستم</p>
        </div>
      </div>

      {/* Latest estates */}

      <div className={styles.latestPanel}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.panelEyebrow}>آخرین فعالیت</span>

            <h3>آخرین املاک ثبت شده</h3>
          </div>

          <Link href="/p-admin/properties" className={styles.viewAll}>
            مشاهده همه
          </Link>
        </div>

        {latestEstates.length === 0 ? (
          <div className={styles.empty}>هنوز ملکی ثبت نشده است.</div>
        ) : (
          <div className={styles.propertyList}>
            {latestEstates.map((estate) => (
              <div key={estate._id.toString()} className={styles.propertyRow}>
                <div className={styles.propertyMain}>
                  <div className={styles.propertyImage}>
                    {estate.thumbnail ? (
                      <img src={estate.thumbnail} alt={estate.title} />
                    ) : (
                      <span>ملک</span>
                    )}
                  </div>

                  <div>
                    <h4>{estate.title}</h4>

                    <span>{estate.location?.city || "بدون شهر"}</span>
                  </div>
                </div>

                <div className={styles.propertyMeta}>
                  <span>{estate.area?.toLocaleString("fa-IR")} متر</span>

                  <StatusBadge status={estate.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StatusRow({ label, value }) {
  return (
    <div className={styles.statusRow}>
      <span>{label}</span>

      <strong>
        {value.toLocaleString("fa-IR")}
      </strong>
    </div>
  );
}

function StatusBadge({ status }) {
  const labels = {
    available: "قابل معامله",
    reserved: "رزرو شده",
    sold: "فروخته شده",
    rented: "اجاره داده شده",
  };

  return (
    <span
      className={`${styles.badge} ${styles[status] || ""}`}
    >
      {labels[status] || status}
    </span>
  );
}

