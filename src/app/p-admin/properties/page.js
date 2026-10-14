import { redirect } from "next/navigation";
import Link from "next/link";
import { authAdmin } from "@/utiles/auth-server";
import FilterBar from "@/components/p-admin/FilterBar";
import PropertyTable from "@/components/p-admin/PropertyTable";
import Pagination from "@/components/p-admin/Pagination";

import styles from "./properties.module.css";

export default async function AdminPropertiesPage({ searchParams }) {
  const admin = await authAdmin();

  if (!admin) {
    redirect("/login-register");
  }

  const params = await searchParams;

  const queryParams = new URLSearchParams();

  const allowedParams = [
    "search",
    "type",
    "transactionType",
    "status",
    "city",
    "sort",
    "page",
    "limit",
  ];

  allowedParams.forEach((key) => {
    if (params[key]) {
      queryParams.set(key, params[key]);
    }
  });

  if (!queryParams.has("page")) {
    queryParams.set("page", "1");
  }

  if (!queryParams.has("limit")) {
    queryParams.set("limit", "10");
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/api/estates?${queryParams.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("خطا در دریافت لیست املاک");
  }

  const result = await response.json();

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>مدیریت املاک</span>

          <h1>لیست املاک</h1>

          <p>
            در این بخش می‌توانید تمام املاک ثبت‌شده در سامانه را مشاهده و مدیریت
            کنید.
          </p>
        </div>

        <Link href="/p-admin/properties/addNewEstate" className={styles.addButton}>
          + افزودن ملک
        </Link>
      </div>

      <div className={styles.summary}>
        <span>تعداد کل املاک:</span>

        <strong>{result.pagination.total.toLocaleString("fa-IR")}</strong>
      </div>

      <FilterBar />

      <PropertyTable properties={result.data} />

      <Pagination
        currentPage={result.pagination.page}
        totalPages={result.pagination.totalPages}
        hasNextPage={result.pagination.hasNextPage}
        hasPreviousPage={result.pagination.hasPreviousPage}
      />
    </section>
  );
}
