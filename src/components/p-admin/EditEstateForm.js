"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import styles from "@/styles/p-admin/AddEstateForm.module.css";
import estateSchema from "@/validators/estateSchema";

export default function EditEstateForm({ estate }) {
  const router = useRouter();

  const [existingImages, setExistingImages] = useState(estate?.images ?? []);

  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(estateSchema),

    defaultValues: {
      title: estate?.title ?? "",
      description: estate?.description ?? "",

      type: estate?.type ?? "",
      transactionType: estate?.transactionType ?? "",
      status: estate?.status ?? "available",

      location: {
        province: estate?.location?.province ?? "",
        city: estate?.location?.city ?? "",
        neighborhood: estate?.location?.neighborhood ?? "",
        address: estate?.location?.address ?? "",

        coordinates: {
          lat: estate?.location?.coordinates?.lat ?? "",
          lng: estate?.location?.coordinates?.lng ?? "",
        },
      },

      price: estate?.price ?? "",
      deposit: estate?.deposit ?? "",
      rent: estate?.rent ?? "",

      area: estate?.area ?? "",
      bedrooms: estate?.bedrooms ?? "",
      bathrooms: estate?.bathrooms ?? "",

      parking: estate?.parking ?? false,

      floor: estate?.floor ?? "",
      totalFloors: estate?.totalFloors ?? "",
      yearBuilt: estate?.yearBuilt ?? "",

      amenities: {
        elevator: estate?.amenities?.elevator ?? false,
        balcony: estate?.amenities?.balcony ?? false,
        storage: estate?.amenities?.storage ?? false,
        furnished: estate?.amenities?.furnished ?? false,
        centralHeating: estate?.amenities?.centralHeating ?? false,
        airConditioning: estate?.amenities?.airConditioning ?? false,
      },
    },
  });

  const transactionType = watch("transactionType");

  /*
  |--------------------------------------------------------------------------
  | مدیریت فیلدهای مالی
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (transactionType === "sale") {
      setValue("deposit", "");
      setValue("rent", "");
    }

    if (transactionType === "rent") {
      setValue("price", "");
    }
  }, [transactionType, setValue]);

  /*
  |--------------------------------------------------------------------------
  | Object URL برای Preview تصاویر جدید
  |--------------------------------------------------------------------------
  */

  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    const urls = newImages.map((file) => URL.createObjectURL(file));

    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImages]);

  /*
  |--------------------------------------------------------------------------
  | حذف تصویر قبلی
  |--------------------------------------------------------------------------
  */

  function handleRemoveExistingImage(image) {
    setExistingImages((prevImages) =>
      prevImages.filter((item) => {
        if (image._id && item._id) {
          return item._id !== image._id;
        }

        if (image.publicId && item.publicId) {
          return item.publicId !== image.publicId;
        }

        return item.url !== image.url;
      }),
    );

    setRemovedImages((prevImages) => [...prevImages, image]);
  }

  /*
  |--------------------------------------------------------------------------
  | حذف تصویر جدید
  |--------------------------------------------------------------------------
  */

  function handleRemoveNewImage(index) {
    setNewImages((prevImages) =>
      prevImages.filter((_, imageIndex) => imageIndex !== index),
    );
  }

  /*
  |--------------------------------------------------------------------------
  | انتخاب تصاویر جدید
  |--------------------------------------------------------------------------
  */

  function handleNewImagesChange(event) {
    const selectedFiles = Array.from(event.target.files || []);

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const maxSize = 5 * 1024 * 1024;
    const maxImages = 10;

    const validationErrors = [];
    const validFiles = [];

    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        validationErrors.push(`فرمت فایل "${file.name}" مجاز نیست.`);
        continue;
      }

      if (file.size > maxSize) {
        validationErrors.push(
          `حجم فایل "${file.name}" بیشتر از ۵ مگابایت است.`,
        );
        continue;
      }

      validFiles.push(file);
    }

    setNewImages((prevImages) => {
      const totalImages =
        existingImages.length + prevImages.length + validFiles.length;

      if (totalImages <= maxImages) {
        return [...prevImages, ...validFiles];
      }

      const availableCount =
        maxImages - existingImages.length - prevImages.length;

      validationErrors.push(`حداکثر ${maxImages} تصویر می‌توانید داشته باشید.`);

      return [
        ...prevImages,
        ...validFiles.slice(0, Math.max(0, availableCount)),
      ];
    });

    if (validationErrors.length > 0) {
      alert(validationErrors.join("\n"));
    }

    // اجازه انتخاب دوباره همان فایل
    event.target.value = "";
  }

  /*
  |--------------------------------------------------------------------------
  | Upload یک تصویر
  |--------------------------------------------------------------------------
  */

  async function uploadImage(file) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "خطا در آپلود تصویر");
    }

    return {
      url: `https://c486181.parspack.net/c486181/${result.key}`,
      publicId: result.key,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Upload همه تصاویر جدید
  |--------------------------------------------------------------------------
  */

  async function uploadNewImages(files) {
    const uploadedImages = [];

    try {
      for (const file of files) {
        const image = await uploadImage(file);

        uploadedImages.push(image);
      }

      return uploadedImages;
    } catch (error) {
      // اگر یکی از آپلودها شکست خورد،
      // تصاویر قبلی که همین عملیات آپلود کرده را پاک می‌کنیم.

      if (uploadedImages.length > 0) {
        await Promise.allSettled(
          uploadedImages.map((image) => deleteImage(image.publicId)),
        );
      }

      throw error;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | حذف تصویر از Parspack
  |--------------------------------------------------------------------------
  */

  async function deleteImage(key) {
    if (!key) return;

    const response = await fetch("/api/upload", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "خطا در حذف تصویر");
    }

    return result;
  }

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  async function onSubmit(data) {
    let uploadedImages = [];

    try {
      setIsSubmitting(true);

      /*
      |--------------------------------------------------------------------------
      | اطلاعات مالی را بر اساس نوع معامله پاک می‌کنیم
      |--------------------------------------------------------------------------
      */

      const cleanedData = {
        ...data,

        ...(data.transactionType === "sale"
          ? {
              deposit: undefined,
              rent: undefined,
            }
          : {
              price: undefined,
            }),
      };

      /*
      |--------------------------------------------------------------------------
      | آپلود تصاویر جدید
      |--------------------------------------------------------------------------
      */

      if (newImages.length > 0) {
        uploadedImages = await uploadNewImages(newImages);
      }

      /*
      |--------------------------------------------------------------------------
      | ساخت لیست نهایی تصاویر
      |--------------------------------------------------------------------------
      */

      const finalImages = [...existingImages, ...uploadedImages];

      /*
      |--------------------------------------------------------------------------
      | اولین تصویر = thumbnail
      |--------------------------------------------------------------------------
      */

      const thumbnail = finalImages[0]?.url || "";

      /*
      |--------------------------------------------------------------------------
      | ارسال اطلاعات به API
      |--------------------------------------------------------------------------
      */

      const response = await fetch(`/api/estates/${estate._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...cleanedData,
          images: finalImages,
          thumbnail,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "خطا در ویرایش ملک");
      }

      /*
      |--------------------------------------------------------------------------
      | حذف تصاویر قدیمی که کاربر حذف کرده است
      |--------------------------------------------------------------------------
      */

      if (removedImages.length > 0) {
        await Promise.allSettled(
          removedImages
            .filter((image) => image.publicId)
            .map((image) => deleteImage(image.publicId)),
        );
      }

      /*
      |--------------------------------------------------------------------------
      | پایان موفق
      |--------------------------------------------------------------------------
      */

      router.push("/p-admin/properties");
      router.refresh();
    } catch (error) {
      console.error("UPDATE ESTATE ERROR:", error);

      /*
      |--------------------------------------------------------------------------
      | اگر API ویرایش شکست خورد،
      | تصاویر جدیدی که آپلود شده بودند پاک شوند.
      |--------------------------------------------------------------------------
      */

      if (uploadedImages.length > 0) {
        await Promise.allSettled(
          uploadedImages.map((image) => deleteImage(image.publicId)),
        );
      }

      alert(error.message || "خطا در ویرایش ملک");
    } finally {
      setIsSubmitting(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h1>ویرایش ملک</h1>
          <p>اطلاعات ملک را ویرایش و تغییرات را ذخیره کنید.</p>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {/* ==================================================
            اطلاعات اصلی
        ================================================== */}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>اطلاعات اصلی</h2>
          </div>

          <div className={styles.fields}>
            <div className={styles.field}>
              <label htmlFor="title">عنوان ملک</label>

              <input id="title" type="text" {...register("title")} />

              {errors.title && (
                <span className={styles.error}>{errors.title.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="type">نوع ملک</label>

              <select id="type" {...register("type")}>
                <option value="">انتخاب کنید</option>

                <option value="apartment">آپارتمان</option>

                <option value="villa">ویلا</option>

                <option value="house">خانه</option>

                <option value="land">زمین</option>

                <option value="commercial">تجاری</option>
              </select>

              {errors.type && (
                <span className={styles.error}>{errors.type.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="transactionType">نوع معامله</label>

              <select id="transactionType" {...register("transactionType")}>
                <option value="">انتخاب کنید</option>

                <option value="sale">فروش</option>

                <option value="rent">اجاره</option>
              </select>

              {errors.transactionType && (
                <span className={styles.error}>
                  {errors.transactionType.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="status">وضعیت ملک</label>

              <select id="status" {...register("status")}>
                <option value="available">موجود</option>

                <option value="reserved">رزرو شده</option>

                <option value="sold">فروخته شده</option>

                <option value="rented">اجاره داده شده</option>
              </select>

              {errors.status && (
                <span className={styles.error}>{errors.status.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="description">توضیحات</label>

              <textarea
                id="description"
                rows={6}
                {...register("description")}
              />

              {errors.description && (
                <span className={styles.error}>
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ==================================================
            اطلاعات مالی
        ================================================== */}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>اطلاعات مالی</h2>
          </div>

          <div className={styles.fields}>
            {transactionType === "sale" && (
              <div className={styles.field}>
                <label htmlFor="price">قیمت فروش</label>

                <input
                  id="price"
                  type="number"
                  min="0"
                  {...register("price", {
                    setValueAs: (value) =>
                      value === "" ? undefined : Number(value),
                  })}
                />

                {errors.price && (
                  <span className={styles.error}>{errors.price.message}</span>
                )}
              </div>
            )}

            {transactionType === "rent" && (
              <>
                <div className={styles.field}>
                  <label htmlFor="deposit">ودیعه</label>

                  <input
                    id="deposit"
                    type="number"
                    min="0"
                    {...register("deposit", {
                      setValueAs: (value) =>
                        value === "" ? undefined : Number(value),
                    })}
                  />

                  {errors.deposit && (
                    <span className={styles.error}>
                      {errors.deposit.message}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="rent">اجاره ماهانه</label>

                  <input
                    id="rent"
                    type="number"
                    min="0"
                    {...register("rent", {
                      setValueAs: (value) =>
                        value === "" ? undefined : Number(value),
                    })}
                  />

                  {errors.rent && (
                    <span className={styles.error}>{errors.rent.message}</span>
                  )}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ==================================================
            موقعیت ملک
        ================================================== */}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>موقعیت ملک</h2>
          </div>

          <div className={styles.fields}>
            <div className={styles.field}>
              <label htmlFor="province">استان</label>

              <input
                id="province"
                type="text"
                {...register("location.province")}
              />

              {errors.location?.province && (
                <span className={styles.error}>
                  {errors.location.province.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="city">شهر</label>

              <input id="city" type="text" {...register("location.city")} />

              {errors.location?.city && (
                <span className={styles.error}>
                  {errors.location.city.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="neighborhood">محله</label>

              <input
                id="neighborhood"
                type="text"
                {...register("location.neighborhood")}
              />

              {errors.location?.neighborhood && (
                <span className={styles.error}>
                  {errors.location.neighborhood.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="address">آدرس</label>

              <textarea
                id="address"
                rows={3}
                {...register("location.address")}
              />

              {errors.location?.address && (
                <span className={styles.error}>
                  {errors.location.address.message}
                </span>
              )}
            </div>
          </div>

          <div className={styles.fields}>
            <div className={styles.field}>
              <label htmlFor="lat">عرض جغرافیایی</label>

              <input
                id="lat"
                type="number"
                step="any"
                {...register("location.coordinates.lat", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {errors.location?.coordinates?.lat && (
                <span className={styles.error}>
                  {errors.location.coordinates.lat.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="lng">طول جغرافیایی</label>

              <input
                id="lng"
                type="number"
                step="any"
                {...register("location.coordinates.lng", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {errors.location?.coordinates?.lng && (
                <span className={styles.error}>
                  {errors.location.coordinates.lng.message}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ==================================================
            مشخصات ملک
        ================================================== */}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>مشخصات ملک</h2>
          </div>

          <div className={styles.fields}>
            <div className={styles.field}>
              <label htmlFor="area">متراژ</label>

              <input
                id="area"
                type="number"
                min="0"
                {...register("area", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {errors.area && (
                <span className={styles.error}>{errors.area.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="bedrooms">تعداد اتاق خواب</label>

              <input
                id="bedrooms"
                type="number"
                min="0"
                {...register("bedrooms", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {errors.bedrooms && (
                <span className={styles.error}>{errors.bedrooms.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="bathrooms">تعداد حمام</label>

              <input
                id="bathrooms"
                type="number"
                min="0"
                {...register("bathrooms", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {errors.bathrooms && (
                <span className={styles.error}>{errors.bathrooms.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="floor">طبقه</label>

              <input
                id="floor"
                type="number"
                min="0"
                {...register("floor", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {errors.floor && (
                <span className={styles.error}>{errors.floor.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="totalFloors">تعداد طبقات ساختمان</label>

              <input
                id="totalFloors"
                type="number"
                min="1"
                {...register("totalFloors", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {errors.totalFloors && (
                <span className={styles.error}>
                  {errors.totalFloors.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="yearBuilt">سال ساخت</label>

              <input
                id="yearBuilt"
                type="number"
                min="1300"
                {...register("yearBuilt", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {errors.yearBuilt && (
                <span className={styles.error}>{errors.yearBuilt.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="parking">پارکینگ</label>

              <select
                id="parking"
                {...register("parking", {
                  setValueAs: (value) => value === "true",
                })}>
                <option value="false">ندارد</option>

                <option value="true">دارد</option>
              </select>

              {errors.parking && (
                <span className={styles.error}>{errors.parking.message}</span>
              )}
            </div>
          </div>
        </section>

        {/* ==================================================
            امکانات
        ================================================== */}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>امکانات</h2>
          </div>

          <div className={styles.fields}>
            <label>
              <input type="checkbox" {...register("amenities.elevator")} />
              آسانسور
            </label>

            <label>
              <input type="checkbox" {...register("amenities.balcony")} />
              بالکن
            </label>

            <label>
              <input type="checkbox" {...register("amenities.storage")} />
              انباری
            </label>

            <label>
              <input type="checkbox" {...register("amenities.furnished")} />
              مبله
            </label>

            <label>
              <input
                type="checkbox"
                {...register("amenities.centralHeating")}
              />
              سیستم گرمایش مرکزی
            </label>

            <label>
              <input
                type="checkbox"
                {...register("amenities.airConditioning")}
              />
              سیستم سرمایش
            </label>
          </div>
        </section>

        {/* ==================================================
            تصاویر فعلی
        ================================================== */}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>تصاویر فعلی</h2>

            <span>{existingImages.length} تصویر</span>
          </div>

          {existingImages.length > 0 ? (
            <div className={styles.imageGrid}>
              {existingImages.map((image, index) => (
                <div
                  className={styles.imageCard}
                  key={image._id || image.publicId || image.url || index}>
                  <img
                    className={styles.imagePreview}
                    src={image.url}
                    alt={image.alt || "تصویر ملک"}
                  />

                  {index === 0 && <span>تصویر اصلی</span>}

                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => handleRemoveExistingImage(image)}>
                    حذف تصویر
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>در حال حاضر تصویری برای این ملک وجود ندارد.</p>
          )}
        </section>

        {/* ==================================================
            تصاویر جدید
        ================================================== */}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>افزودن تصاویر جدید</h2>

            <span>
              {existingImages.length + newImages.length}
              /10
            </span>
          </div>

          <div className={styles.field}>
            <label htmlFor="newImages">انتخاب تصاویر</label>

            <input
              id="newImages"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleNewImagesChange}
            />

            <small>
              حداکثر ۱۰ تصویر، هر تصویر حداکثر ۵ مگابایت و با فرمت JPG، PNG یا
              WEBP
            </small>
          </div>

          {newImages.length > 0 && (
            <div className={styles.imageGrid}>
              {newImages.map((file, index) => (
                <div
                  className={styles.imageCard}
                  key={`${file.name}-${file.size}-${index}`}>
                  <img
                    className={styles.imagePreview}
                    src={previewUrls[index]}
                    alt={file.name}
                  />

                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => handleRemoveNewImage(index)}>
                    حذف تصویر
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ==================================================
            دکمه‌ها
        ================================================== */}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.submitButton}
            onClick={() => router.push("/p-admin/properties")}
            disabled={isSubmitting}>
            انصراف
          </button>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}>
            {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </div>
      </form>
    </section>
  );
}
