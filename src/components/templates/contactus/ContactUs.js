"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import contactSchema from "@/validators/contactSchema";

import styles from "./contactUs.module.css";
import useContact from "@/hooks/useContact";
import Swal from "sweetalert2";
export default function ContactPage() {
 const {
   register,
   handleSubmit,
   formState: { errors },
   reset
 } = useForm({
   resolver: zodResolver(contactSchema),

   defaultValues: {
     name: "",
     email: "",
     phone: "",
     message: "",
   },
 });
  const { mutate, isPending, isSuccess, isError, error } = useContact();
  

  const onSubmit = (data) => {
   
    
    mutate(data, {
      onSuccess: (result) => {
        reset();

        Swal.fire({

          title: "پیام با موفقیت ارسال شد",
          button:"success"
        })
 
  

  
      },

      onError: (error) => {
          Swal.fire({
            title: " ارسال پیام با خطا مواجه شد لطفا دوباره تلاش کنید",
            button: "warning",
          });
      },
    });
  };

  return (
    <main className={styles.contactPage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span>ارتباط با ما</span>

          <h1>با ما در ارتباط باشید</h1>

          <p>
            اگر درباره خرید، فروش یا اجاره ملک سوالی دارید، خوشحال می‌شویم با
            شما در ارتباط باشیم.
          </p>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.info}>
          <div className={styles.sectionTitle}>
            <span>اطلاعات تماس</span>
            <h2>چطور می‌توانیم کمکتان کنیم؟</h2>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <div className={styles.icon}>📍</div>

              <div>
                <h3>آدرس</h3>
                <p>لار, خیابان اصلی، دفتر املاک K&S</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.icon}>☎</div>

              <div>
                <h3>شماره تماس</h3>
                <p>۰۹۱۷ ۸۹۲ ۲۵۸۲</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.icon}>✉</div>

              <div>
                <h3>ایمیل</h3>
                <p>info@ksamlak.ir</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.icon}>◷</div>

              <div>
                <h3>ساعات کاری</h3>
                <p>شنبه تا پنجشنبه، ۹ صبح تا ۸ شب</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formWrapper}>
          <div className={styles.sectionTitle}>
            <span>ارسال پیام</span>
            <h2>پیام خود را برای ما ارسال کنید</h2>
          </div>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="name">نام و نام خانوادگی</label>

                <input
                  id="name"
                  type="text"
                  placeholder="نام شما"
                  {...register("name")}
                />
                {errors.name && (
                  <span className={styles.error}>{errors.name.message}</span>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="phone">شماره تماس</label>

                <input
                  id="phone"
                  type="tel"
                  placeholder="شماره تماس"
                  {...register("phone")}
                />

                {errors.phone && (
                  <span className={styles.error}>{errors.phone.message}</span>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="email">ایمیل</label>

              <input
                id="email"
                type="email"
                placeholder="example@email.com"
                {...register("email")}
              />

              {errors.email && (
                <span className={styles.error}>{errors.email.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="message">پیام</label>

              <textarea
                id="message"
                rows="6"
                placeholder="پیام خود را بنویسید..."
                {...register("message")}
              />

              {errors.message && (
                <span className={styles.error}>{errors.message.message}</span>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isPending}>
              {isPending ? "در حال ارسال..." : "ارسال پیام"}
            </button>
            
          </form>
        </div>
      </section>
    </main>
  );
}
