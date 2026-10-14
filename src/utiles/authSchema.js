
import { z } from "zod";

const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "وارد کردن شماره موبایل الزامی است")
    .regex(/^09\d{9}$/, "شماره موبایل صحیح نیست"),
});

const registerSchema = z.object({
  name: z
    .string()
    .min(1, "وارد کردن نام الزامی است")
    .min(3, "نام باید حداقل ۳ کاراکتر باشد"),

  phone: z
    .string()
    .min(1, "وارد کردن شماره موبایل الزامی است")
    .regex(/^09\d{9}$/, "شماره موبایل صحیح نیست"),

  email: z
    .string()
    .email("فرمت ایمیل صحیح نیست")
    .optional()
    .or(z.literal("")),
});

const otpSchema = z.object({
  otp: z
    .string()
    .min(1, "وارد کردن کد تأیید الزامی است")
    .regex(/^\d{5}$/, "کد تأیید باید ۵ رقم باشد"),
});

export {
  loginSchema,
  registerSchema,
  otpSchema,
};

