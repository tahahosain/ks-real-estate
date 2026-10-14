"use client";

import { useEffect, useState } from "react";

import PropertyCard from "@/components/features/PropertyCard/PropertyCard";
import PropertyFilter from "@/components/features/propertyFilter/PropertyFilter";

import useEstates from "@/hooks/useEstates";

import styles from "@/styles/homeDetails.module.css";

const initialFilters = {
  search: "",
  type: "",
  city: "",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  bedrooms: "",
  bathrooms: "",
  parking: false,
  transactionType: "",
  sort: "",
};

export default function Houses() {
  const [filters, setFilters] = useState(initialFilters);

  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useEstates({
    filters,
    page,
  });

  const properties = data?.data ?? [];
  
   
  


  const pagination = data?.pagination ?? null;

  // =========================
  // Submit Filter
  // =========================

  const handleFilterSubmit = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  // =========================
  // Pagination
  // =========================

  const goToPage = (pageNumber) => {
    if (!pagination) return;

    if (pageNumber < 1 || pageNumber > pagination.totalPages) {
      return;
    }

    setPage(pageNumber);
  };

  return (
    <main>
      <PropertyFilter onSubmit={handleFilterSubmit} />

      {isLoading && <p>در حال دریافت املاک...</p>}

      {isError && <p>{error?.message || "خطا در دریافت املاک"}</p>}

      {!isLoading && !isError && properties.length === 0 && (
        <p>ملکی با این مشخصات پیدا نشد.</p>
      )}

      {!isLoading && properties.length > 0 && (
        <div className={styles.wrraperHouses}>
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}

      {/* Pagination */}

      {!isLoading && pagination && pagination.totalPages > 1 && (
        <nav className={styles.pagination} aria-label="صفحه‌بندی">
          <button
            className={styles.paginationItem}
            type="button"
            disabled={!pagination.hasPreviousPage}
            onClick={() => goToPage(pagination.page - 1)}>
            قبلی
          </button>

          {Array.from(
            {
              length: pagination.totalPages,
            },
            (_, index) => {
              const pageNumber = index + 1;

              return (
                <button
                  className={`${styles.paginationList} ${styles.paginationButton}`}
                  key={pageNumber}
                  type="button"
                  disabled={pageNumber === pagination.page}
                  onClick={() => goToPage(pageNumber)}>
                  {pageNumber}
                </button>
              );
            },
          )}

          <button
            className={styles.paginationItem}
            type="button"
            disabled={!pagination.hasNextPage}
            onClick={() => goToPage(pagination.page + 1)}>
            بعدی
          </button>
        </nav>
      )}
    </main>
  );
}
