import { redirect } from "next/navigation";
import { authAdmin } from "@/utiles/auth-server";
import Link from "next/link";
import styles from "@/styles/p-admin/rejected.module.css";
import RejectedPropertyList from "@/components/p-admin/RejectedPropertyList";
export default async function RejectedPropertiesPage() {
  const admin = await authAdmin();

  if (!admin) {
    redirect("/login-register");
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/api/estates?status=rejected&page=1&limit=50`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("خطا در دریافت املاک ردشده");
  }

  const result = await response.json();
  const properties = result.data || [];

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>مدیریت املاک</span>
          <h1>املاک ردشده</h1>
          <p>فهرست املاکی که درخواست ثبت آن‌ها توسط مدیر رد شده است.</p>
        </div>

        <Link href="/p-admin/properties" className={styles.backButton}>
          بازگشت به لیست املاک
        </Link>
      </header>

      <div className={styles.summary}>
        <span>تعداد املاک ردشده:</span>
        <strong>
          {(result.pagination?.total || 0).toLocaleString("fa-IR")}
        </strong>
      </div>

      <RejectedPropertyList properties={properties} />
    </section>
  );
}
