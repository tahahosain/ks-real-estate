import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "نام باید حداقل ۲ کاراکتر باشد"),

  email: z.string().trim().email("ایمیل وارد شده صحیح نیست").or(z.literal("")),

  phone: z
    .string()
    .trim()
    .regex(/^[+]?[0-9]{10,15}$/, "شماره تماس معتبر نیست"),

  message: z.string().trim().min(10, "پیام باید حداقل ۱۰ کاراکتر باشد"),
});

export default contactSchema;
