"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "@/utiles/authSchema";
import { verifyOtp } from "@/actions/auth/authActions";

import styles from "./otpForm.module.css";
import { useRouter } from "next/navigation";

export default function OtpForm({ phone, authData, onBack }) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(otpSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
  

    const result = await verifyOtp({
      phone: authData.phone,
      code: data.otp,
      mode: authData.mode,
      name: authData.name,
      email: authData.email,
    });

    

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert(result.message);

   router.push('/')
    // window.location.href = "/";
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.header}>
        <h2>تأیید شماره موبایل</h2>

        <p>کد تأیید ارسال شده به شماره</p>

        <strong>{phone}</strong>

        <p>را وارد نمایید</p>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="otp">کد تأیید</label>

        <input
          id="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={5}
          placeholder="کد ۵ رقمی"
          {...register("otp")}
        />

        {errors.otp && (
          <span className={styles.error}>{errors.otp.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "در حال بررسی..." : "تأیید کد"}
      </button>

      <button type="button" onClick={onBack} disabled={isSubmitting}>
        بازگشت
      </button>
    </form>
  );
}
