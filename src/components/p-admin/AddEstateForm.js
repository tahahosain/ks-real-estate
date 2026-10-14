"use client";
import {useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import styles from "@/styles/p-admin/AddEstateForm.module.css";
import useCreateEstate from "@/hooks/useCreateEstate";
import { zodResolver } from "@hookform/resolvers/zod";
import estateSchema from "@/validators/estateSchema";
export default function AddEstateForm({ mode = "admin" }) {
  //..........Variables..............//
  const router = useRouter();
  const [images, setImages] = useState([]);
  const {
    mutateAsync: createEstate,
    isPending,
    isSuccess,
    isError,
    error,
  } = useCreateEstate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(estateSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      transactionType: "",
      status:"available",

      location: {
        province: "",
        city: "",
        neighborhood: "",
        address: "",
        coordinates: {
          lat: "",
          lng: "",
        },
      },

      area: "",
      bedrooms: "",
      bathrooms: "",
      parking: false,
      floor: "",
      totalFloors: "",
      yearBuilt: "",
      price: "",
      deposit: "",
      rent: "",
      amenities: {
        elevator: false,
        balcony: false,
        storage: false,
        furnished: false,
        centralHeating: false,
        airConditioning: false,
      },
    },
  });
  const transactionType = watch("transactionType");

  useEffect(() => {
    if (transactionType === "sale") {
      setValue("deposit", "");
      setValue("rent", "");
    }

    if (transactionType === "rent") {
      setValue("price", "");
    }
  }, [transactionType, setValue]);

  //......... Handle Images Functions............//
  function handleImageChange(event) {
    const selectedFiles = Array.from(event.target.files);

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxImages = 10;

    const validFiles = [];
    const errors = [];

    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`فرمت فایل "${file.name}" مجاز نیست.`);
        continue;
      }

      if (file.size > maxSize) {
        errors.push(`حجم فایل "${file.name}" بیشتر از 5 مگابایت است.`);
        continue;
      }

      validFiles.push(file);
    }

    setImages((prevImages) => {
      const totalImages = prevImages.length + validFiles.length;

      if (totalImages > maxImages) {
        errors.push(`حداکثر ${maxImages} تصویر می‌توانید انتخاب کنید.`);

        const availableCount = maxImages - prevImages.length;

        return [
          ...prevImages,
          ...validFiles.slice(0, Math.max(0, availableCount)),
        ];
      }

      return [...prevImages, ...validFiles];
    });

    if (errors.length > 0) {
      alert(errors.join("\n"));
    }

    // اجازه انتخاب دوباره همان فایل
    event.target.value = "";
  }
  function handleRemoveImage(index) {
    setImages((prevImages) =>
      prevImages.filter((_, imageIndex) => imageIndex !== index),
    );
  }
  //............Upload Images To Buket Storeg...........//
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
  async function uploadImages(files) {
    const uploadedImages = [];

    try {
      for (const file of files) {
        const image = await uploadImage(file);

        uploadedImages.push(image);
      }

      return uploadedImages;
    } catch (error) {
      if (uploadedImages.length > 0) {
        await Promise.allSettled(
          uploadedImages.map((image) => deleteImage(image.publicId)),
        );
      }

      throw error;
    }
  }
  //..............DELETE Images Sometime Unsuccesse Uploade..............//
  async function deleteImage(key) {
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
  // ..........Submit Handler............//

  async function onSubmit(data) {
    let uploadedImages = [];

    try {
      if (images.length > 0) {
        uploadedImages = await uploadImages(images);
      }

      const estateData = {
        ...data,
        images: uploadedImages,
        thumbnail: uploadedImages[0]?.url || "",
      };

      await createEstate(estateData);

      reset();
      setImages([]);

      router.push(mode === "admin" ? "/p-admin/properties" : "/p-user");
    } catch (error) {
      console.error("CREATE ESTATE ERROR:", error);

      if (uploadedImages.length > 0) {
        await Promise.allSettled(
          uploadedImages.map((image) => deleteImage(image.publicId)),
        );
      }

      console.error("Uploaded images were cleaned up.");
    }
  }
  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {/* اطلاعات اصلی */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>اطلاعات اصلی ملک</h2>
            <p>اطلاعات پایه ملک را وارد کنید.</p>
          </div>

          <div className={styles.fields}>
            {/* عنوان */}
            <div className={styles.field}>
              <label htmlFor="title">عنوان ملک</label>

              <input
                id="title"
                type="text"
                placeholder="مثلاً آپارتمان دو خوابه در شیراز"
                {...register("title")}
              />
              {errors.title && (
                <span className={styles.error}>{errors.title.message}</span>
              )}
            </div>

            {/* نوع ملک */}
            <div className={styles.field}>
              <label htmlFor="type">نوع ملک</label>

              <select id="type" {...register("type")}>
                <option value="">انتخاب نوع ملک</option>
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

            {/* نوع معامله */}
            <div className={styles.field}>
              <label htmlFor="transactionType">نوع معامله</label>

              <select id="transactionType" {...register("transactionType")}>
                <option value="">انتخاب نوع معامله</option>
                <option value="sale">فروش</option>
                <option value="rent">اجاره</option>
              </select>
              {errors.transactionType && (
                <span className={styles.error}>
                  {errors.transactionType.message}
                </span>
              )}
            </div>

            {/* وضعیت */}
            {mode === "admin" && (
              <div className={styles.field}>
                <label htmlFor="status">وضعیت ملک</label>

                <select id="status" {...register("status")}>
                  <option value="available">موجود</option>
                  <option value="reserved">رزرو شده</option>
                  <option value="sold">فروخته شده</option>
                  <option value="rented">اجاره داده شده</option>
                </select>
              </div>
            )}

            {/* توضیحات */}
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label htmlFor="description">توضیحات</label>

              <textarea
                id="description"
                rows="6"
                placeholder="توضیحات کامل درباره ملک..."
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
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>موقعیت ملک</h2>
            <p>آدرس و موقعیت ملک را وارد کنید.</p>
          </div>

          <div className={styles.fields}>
            {/* استان */}
            <div className={styles.field}>
              <label htmlFor="province">استان</label>

              <input
                id="province"
                type="text"
                placeholder="مثلاً فارس"
                {...register("location.province")}
              />
              {errors.location?.province && (
                <span className={styles.error}>
                  {errors.location?.province.message}
                </span>
              )}
            </div>

            {/* شهر */}
            <div className={styles.field}>
              <label htmlFor="city">شهر</label>

              <input
                id="city"
                type="text"
                placeholder="مثلاً شیراز"
                {...register("location.city")}
              />

              {errors.location?.city && (
                <span className={styles.error}>
                  {errors.location?.city.message}
                </span>
              )}
            </div>

            {/* محله */}
            <div className={styles.field}>
              <label htmlFor="neighborhood">محله</label>

              <input
                id="neighborhood"
                type="text"
                placeholder="مثلاً معالی‌آباد"
                {...register("location.neighborhood")}
              />
            </div>

            {/* آدرس */}
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label htmlFor="address">آدرس کامل</label>

              <textarea
                id="address"
                rows="4"
                placeholder="آدرس کامل ملک..."
                {...register("location.address")}
              />
              {errors.location?.address && (
                <span className={styles.error}>
                  {errors.location?.address.message}
                </span>
              )}
            </div>

            {/* عرض جغرافیایی */}
            <div className={styles.field}>
              <label htmlFor="lat">عرض جغرافیایی</label>

              <input
                id="lat"
                type="number"
                step="any"
                placeholder="مثلاً 29.5918"
                {...register("location.coordinates.lat", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />
            </div>

            {/* طول جغرافیایی */}
            <div className={styles.field}>
              <label htmlFor="lng">طول جغرافیایی</label>

              <input
                id="lng"
                type="number"
                step="any"
                placeholder="مثلاً 52.5837"
                {...register("location.coordinates.lng", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />
            </div>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>مشخصات فیزیکی ملک</h2>
            <p>مشخصات اصلی و فیزیکی ملک را وارد کنید.</p>
          </div>

          <div className={styles.fields}>
            {/* متراژ */}
            <div className={styles.field}>
              <label htmlFor="area">متراژ</label>

              <input
                id="area"
                type="number"
                min="0"
                placeholder="مثلاً 120"
                {...register("area", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />
              {errors.area && (
                <span className={styles.error}>{errors.area.message}</span>
              )}
            </div>

            {/* تعداد اتاق خواب */}
            <div className={styles.field}>
              <label htmlFor="bedrooms">تعداد اتاق خواب</label>

              <input
                id="bedrooms"
                type="number"
                min="0"
                placeholder="مثلاً 2"
                {...register("bedrooms", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {errors.bedrooms && (
                <span className={styles.error}>{errors.bedrooms.message}</span>
              )}
            </div>

            {/* تعداد حمام */}
            <div className={styles.field}>
              <label htmlFor="bathrooms">تعداد حمام</label>

              <input
                id="bathrooms"
                type="number"
                min="0"
                placeholder="مثلاً 2"
                {...register("bathrooms", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {errors.bathrooms && (
                <span className={styles.error}>{errors.bathrooms.message}</span>
              )}
            </div>

            {/* پارکینگ */}
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
            </div>

            {/* طبقه */}
            <div className={styles.field}>
              <label htmlFor="floor">طبقه</label>

              <input
                id="floor"
                type="number"
                min="0"
                placeholder="مثلاً 3"
                {...register("floor", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {errors.floor && (
                <span className={styles.error}>{errors.floor.message}</span>
              )}
            </div>

            {/* تعداد کل طبقات */}
            <div className={styles.field}>
              <label htmlFor="totalFloors">تعداد کل طبقات</label>

              <input
                id="totalFloors"
                type="number"
                min="1"
                placeholder="مثلاً 5"
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

            {/* سال ساخت */}
            <div className={styles.field}>
              <label htmlFor="yearBuilt">سال ساخت</label>

              <input
                id="yearBuilt"
                type="number"
                min="1300"
                placeholder="مثلاً 1402"
                {...register("yearBuilt", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {errors.yearBuilt && (
                <span className={styles.error}>{errors.yearBuilt.message}</span>
              )}
            </div>
          </div>
        </section>
        {/* اطلاعات مالی*/}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>اطلاعات مالی</h2>

            <p>اطلاعات مربوط به قیمت و شرایط معامله را وارد کنید.</p>
          </div>

          <div className={styles.fields}>
            {/* فروش */}
            {transactionType === "sale" && (
              <div className={styles.field}>
                <label htmlFor="price">قیمت ملک</label>

                <input
                  id="price"
                  type="number"
                  min="0"
                  placeholder="مثلاً 5000000000"
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

            {/* اجاره */}
            {transactionType === "rent" && (
              <>
                <div className={styles.field}>
                  <label htmlFor="deposit">ودیعه</label>

                  <input
                    id="deposit"
                    type="number"
                    min="0"
                    placeholder="مثلاً 500000000"
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
                    placeholder="مثلاً 15000000"
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
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>امکانات ملک</h2>
            <p>امکانات و ویژگی‌های اضافی ملک را انتخاب کنید.</p>
          </div>

          <div className={styles.amenitiesGrid}>
            <label className={styles.checkboxItem}>
              <input type="checkbox" {...register("amenities.elevator")} />
              <span>آسانسور</span>
            </label>

            <label className={styles.checkboxItem}>
              <input type="checkbox" {...register("amenities.balcony")} />
              <span>بالکن</span>
            </label>

            <label className={styles.checkboxItem}>
              <input type="checkbox" {...register("amenities.storage")} />
              <span>انباری</span>
            </label>

            <label className={styles.checkboxItem}>
              <input type="checkbox" {...register("amenities.furnished")} />
              <span>مبله</span>
            </label>

            <label className={styles.checkboxItem}>
              <input
                type="checkbox"
                {...register("amenities.centralHeating")}
              />
              <span>گرمایش مرکزی</span>
            </label>

            <label className={styles.checkboxItem}>
              <input
                type="checkbox"
                {...register("amenities.airConditioning")}
              />
              <span>سیستم تهویه</span>
            </label>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>تصاویر ملک</h2>
            <p>تصاویر باکیفیت از ملک را انتخاب کنید.</p>
          </div>

          <div className={styles.imageUpload}>
            <label className={styles.uploadBox}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />

              <span className={styles.uploadIcon}>+</span>

              <span className={styles.uploadTitle}>انتخاب تصاویر</span>

              <span className={styles.uploadDescription}>
                می‌توانید چند تصویر را هم‌زمان انتخاب کنید.
              </span>
            </label>
          </div>

          {images.length > 0 && (
            <div className={styles.imagePreviewGrid}>
              {images.map((image, index) => (
                <div
                  key={`${image.name}-${index}`}
                  className={styles.imagePreview}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`تصویر ملک ${index + 1}`}
                  />

                  {index === 0 && (
                    <span className={styles.mainImageBadge}>تصویر اصلی</span>
                  )}

                  <button
                    type="button"
                    className={styles.removeImage}
                    onClick={() => handleRemoveImage(index)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
        <div className={styles.actions}>
          <button
            type="submit"
            disabled={isPending}
            className={styles.submitButton}>
            {isPending ? "در حال ثبت ملک..." : "ثبت ملک"}
          </button>
        </div>
      </form>
      {isSuccess && (
        <div className={styles.successMessage}>ملک با موفقیت ثبت شد.</div>
      )}
      {isError && (
        <div className={styles.errorMessage}>
          {error?.message || "خطا در ثبت ملک"}
        </div>
      )}
    </>
  );
}
