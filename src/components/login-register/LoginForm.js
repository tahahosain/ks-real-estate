
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "@/utiles/authSchema";
import styles from "./loginForm.module.css";
import { sendOtp } from "@/actions/auth/authActions";
export default function LoginForm({ showRegisterForm, showOtpForm }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    console.log("Login Data =>", data);

    const result = await sendOtp({
      phone: data.phone,
      mode: "login",
    });

    console.log("Send OTP Result =>", result);

    if (!result.success) {
      alert(result.message);
      return;
    }

    showOtpForm(data, "login");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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

      <button type="submit" disabled={isSubmitting} >
        {isSubmitting ? "در حال ارسال..." : "دریافت کد تأیید"}
      </button>

      <button type="button" onClick={showRegisterForm}>
        ثبت نام
      </button>
    </form>
  );
}
;
