"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "@/utiles/authSchema";
import { sendOtp } from "@/actions/auth/authActions";

import styles from "./registerForm.module.css";

export default function RegisterForm({ showLoginForm, showOtpForm }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
   

    const result = await sendOtp({
      phone: data.phone,
      mode: "register",
    });

    

    if (!result.success) {
      alert(result.message);
      return;
    }

    showOtpForm(data, "register");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formGroup}>
        <label htmlFor="name">نام</label>

        <input
          id="name"
          type="text"
          placeholder="نام خود را وارد کنید"
          {...register("name")}
        />

        {errors.name && (
          <span className={styles.error}>{errors.name.message}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">شماره موبایل</label>

        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          placeholder="09123456789"
          {...register("phone")}
        />

        {errors.phone && (
          <span className={styles.error}>{errors.phone.message}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">
          ایمیل <span>(اختیاری)</span>
        </label>

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

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "در حال ارسال..." : "دریافت کد تأیید"}
      </button>

      <button type="button" disabled={isSubmitting} onClick={showLoginForm}>
        ورود
      </button>
    </form>
  );
}
