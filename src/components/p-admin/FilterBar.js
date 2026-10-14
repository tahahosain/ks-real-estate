"use client";

import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "@/styles/p-admin/FilterBar.module.css";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      search: searchParams.get("search") || "",
      type: searchParams.get("type") || "",
      transactionType: searchParams.get("transactionType") || "",
      status: searchParams.get("status") || "",
      city: searchParams.get("city") || "",
      sort: searchParams.get("sort") || "newest",
    },
  });

  function onSubmit(data) {
    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    params.set("page", "1");
    params.set("limit", "3");

    router.push(`/p-admin/properties?${params.toString()}`);
  }

  function handleReset() {
    reset({
      search: "",
      type: "",
      transactionType: "",
      status: "",
      city: "",
      sort: "newest",
    });

    router.push("/p-admin/properties");
  }

  return (
    <form className={styles.filterBar} onSubmit={handleSubmit(onSubmit)}>
      {/* Search */}

      <div className={styles.searchWrapper}>
        <label htmlFor="search">جستجوی ملک</label>

        <input
          id="search"
          type="text"
          placeholder="عنوان ملک را جستجو کنید..."
          {...register("search")}
        />
      </div>

      {/* Property Type */}

      <div className={styles.field}>
        <label htmlFor="type">نوع ملک</label>

        <select id="type" {...register("type")}>
          <option value="">همه</option>

          <option value="apartment">آپارتمان</option>

          <option value="villa">ویلا</option>

          <option value="house">خانه</option>

          <option value="land">زمین</option>

          <option value="commercial">تجاری</option>
        </select>
      </div>

      {/* Transaction Type */}

      <div className={styles.field}>
        <label htmlFor="transactionType">نوع معامله</label>

        <select id="transactionType" {...register("transactionType")}>
          <option value="">همه</option>

          <option value="sale">فروش</option>

          <option value="rent">اجاره</option>
        </select>
      </div>

      {/* Status */}

      <div className={styles.field}>
        <label htmlFor="status">وضعیت</label>

        <select id="status" {...register("status")}>
          <option value="">همه</option>

          <option value="available">موجود</option>

          <option value="reserved">رزرو شده</option>

          <option value="sold">فروخته شده</option>

          <option value="rented">اجاره داده شده</option>
        </select>
      </div>

      {/* City */}

      <div className={styles.field}>
        <label htmlFor="city">شهر</label>

        <input
          id="city"
          type="text"
          placeholder="مثلاً شیراز"
          {...register("city")}
        />
      </div>

      {/* Sort */}

      <div className={styles.field}>
        <label htmlFor="sort">مرتب‌سازی</label>

        <select id="sort" {...register("sort")}>
          <option value="newest">جدیدترین</option>

          <option value="price-asc">قیمت: کم به زیاد</option>

          <option value="price-desc">قیمت: زیاد به کم</option>

          <option value="area-asc">متراژ: کم به زیاد</option>

          <option value="area-desc">متراژ: زیاد به کم</option>

          <option value="bedrooms-asc">اتاق خواب: کم به زیاد</option>

          <option value="bedrooms-desc">اتاق خواب: زیاد به کم</option>
        </select>
      </div>

      {/* Actions */}

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton}>
          اعمال فیلتر
        </button>

        <button
          type="button"
          className={styles.resetButton}
          onClick={handleReset}>
          حذف فیلترها
        </button>
      </div>
    </form>
  );
}
