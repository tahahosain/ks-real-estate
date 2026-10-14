"use client";

import { useForm } from "react-hook-form";
import styles from "./PropertyFilter.module.css";
import Input from "@/components/ui/input";

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

export default function PropertyFilter({ onSubmit }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialFilters,
  });

  const submitHandler = (data) => {
    onSubmit(data);
  };

  const resetHandler = () => {
    reset(initialFilters);
    onSubmit(initialFilters);
  };

  return (
    <section className={styles.filter}>
      <div className={styles.header}>
        <div>
          <h2>جستجوی ملک</h2>
          <p>ملک مورد نظر خود را پیدا کنید.</p>
        </div>

        <button
          type="button"
          className={styles.resetButton}
          onClick={resetHandler}>
          پاک کردن فیلترها
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
        {/* Search */}

        <div className={`${styles.field} ${styles.searchField}`}>
          <label htmlFor="search">جستجو</label>

          <Input
            id="search"
            type="text"
            placeholder="عنوان ملک را وارد کنید..."
            {...register("search")}
          />
        </div>

        {/* Type */}

        <div className={styles.field}>
          <label htmlFor="type">نوع ملک</label>

          <select id="type" {...register("type")}>
            <option value="">همه انواع</option>

            <option value="apartment">آپارتمان</option>

            <option value="villa">ویلا</option>

            <option value="house">خانه</option>
          </select>
        </div>

        {/* City */}

        <div className={styles.field}>
          <label htmlFor="city">شهر</label>

          <select id="city" {...register("city")}>
            <option value="">همه شهرها</option>

            <option value="tehran">تهران</option>

            <option value="nowshahr">نوشهر</option>

            <option value="lahijan">لاهیجان</option>
          </select>
        </div>

        {/* Transaction */}

        <div className={styles.field}>
          <label htmlFor="transactionType">نوع معامله</label>

          <select id="transactionType" {...register("transactionType")}>
            <option value="">همه</option>

            <option value="sale">فروش</option>

            <option value="rent">اجاره</option>
          </select>
        </div>

        {/* Price */}

        <div className={styles.fieldGroup}>
          <span className={styles.groupTitle}>قیمت</span>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="minPrice">حداقل</label>

              <Input id="minPrice" type="number" {...register("minPrice")} />
            </div>

            <div className={styles.field}>
              <label htmlFor="maxPrice">حداکثر</label>

              <Input id="maxPrice" type="number" {...register("maxPrice")} />
            </div>
          </div>
        </div>

        {/* Area */}

        <div className={styles.fieldGroup}>
          <span className={styles.groupTitle}>متراژ</span>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="minArea">حداقل</label>

              <Input id="minArea" type="number" {...register("minArea")} />
            </div>

            <div className={styles.field}>
              <label htmlFor="maxArea">حداکثر</label>

              <Input id="maxArea" type="number" {...register("maxArea")} />
            </div>
          </div>
        </div>

        {/* Bedrooms */}

        <div className={styles.field}>
          <label htmlFor="bedrooms">اتاق خواب</label>

          <select id="bedrooms" {...register("bedrooms")}>
            <option value="">همه</option>
            <option value="1">۱ اتاق به بالا</option>
            <option value="2">۲ اتاق به بالا</option>
            <option value="3">۳ اتاق به بالا</option>
            <option value="4">۴ اتاق به بالا</option>
          </select>
        </div>

        {/* Bathrooms */}

        <div className={styles.field}>
          <label htmlFor="bathrooms">سرویس بهداشتی</label>

          <select id="bathrooms" {...register("bathrooms")}>
            <option value="">همه</option>
            <option value="1">۱ سرویس به بالا</option>
            <option value="2">۲ سرویس به بالا</option>
            <option value="3">۳ سرویس به بالا</option>
          </select>
        </div>

        {/* Parking */}

        <label className={styles.checkbox}>
          <input type="checkbox" {...register("parking")} />

          <span>فقط املاک دارای پارکینگ</span>
        </label>

        {/* Sort */}

        <div className={styles.field}>
          <label htmlFor="sort">مرتب‌سازی</label>

          <select id="sort" {...register("sort")}>
            <option value="">پیش‌فرض</option>

            <option value="price-asc">ارزان‌ترین</option>

            <option value="price-desc">گران‌ترین</option>

            <option value="area-asc">کمترین متراژ</option>

            <option value="area-desc">بیشترین متراژ</option>

            <option value="bedrooms-desc">بیشترین اتاق خواب</option>
          </select>
        </div>

        <button type="submit" className={`${styles.resetButton} btn`}>
          جستجو
        </button>
      </form>
    </section>
  );
}
