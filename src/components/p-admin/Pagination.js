"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import styles from "@/styles/p-admin/Pagination.module.css";

export default function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToPage(page) {
    if (page < 1 || page > totalPages) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());

    router.push(`${pathname}?${params.toString()}`);
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={styles.pagination} aria-label="صفحه‌بندی املاک">
      <button
        type="button"
        disabled={!hasPreviousPage}
        onClick={() => goToPage(currentPage - 1)}
        className={styles.arrowButton}>
        قبلی
      </button>

      <div className={styles.pages}>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              className={
                page === currentPage
                  ? `${styles.pageButton} ${styles.active}`
                  : styles.pageButton
              }
              aria-current={page === currentPage ? "page" : undefined}>
              {page.toLocaleString("fa-IR")}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        disabled={!hasNextPage}
        onClick={() => goToPage(currentPage + 1)}
        className={styles.arrowButton}>
        بعدی
      </button>
    </nav>
  );
}
