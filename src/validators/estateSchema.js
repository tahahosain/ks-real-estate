import { z } from "zod";

const estateSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "عنوان ملک الزامی است")
      .max(150, "عنوان ملک نباید بیشتر از ۱۵۰ کاراکتر باشد"),

    description: z.string().trim().min(1, "توضیحات ملک الزامی است"),

    type: z.enum(["apartment", "villa", "house", "land", "commercial"], {
      error: "نوع ملک را انتخاب کنید",
    }),

    transactionType: z.enum(["sale", "rent"], {
      error: "نوع معامله را انتخاب کنید",
    }),

    status: z.enum(["available", "reserved", "sold", "rented"], {
      error: "وضعیت ملک نامعتبر است",
    }),

    price:z.preprocess(
      (value) => {
        if (value === "" || value === undefined || value === null) {
          return undefined;
        }

        return Number(value);
      },
      z.number().min(0, "قیمت نمی‌تواند منفی باشد").optional()),

    deposit:z.preprocess(
      (value) => {
        if (value === "" || value === undefined || value === null) {
          return undefined;
        }

        return Number(value);
      },
    
      z.number().min(0, "ودیعه نمی‌تواند منفی باشد").optional()),

    rent:z.preprocess(
      (value) => {
        if (value === "" || value === undefined || value === null) {
          return undefined;
        }

        return Number(value);
      },
      z.number().min(0, "اجاره نمی‌تواند منفی باشد").optional()),

    area: z.preprocess(
      (value) => {
        if (value === "" || value === undefined || value === null) {
          return undefined;
        }

        return Number(value);
      },
      z
        .number({
          error: "متراژ الزامی است",
        })
        .min(0, "متراژ نمی‌تواند منفی باشد"),
    ),

    bedrooms: z.preprocess(
      (value) => {
        if (value === "" || value === undefined || value === null) {
          return undefined;
        }

        return Number(value);
      },
      z
        .number({
          error: "تعداد اتاق خواب الزامی است",
        })
        .int("تعداد اتاق خواب باید عدد صحیح باشد")
        .min(0, "تعداد اتاق خواب نمی‌تواند منفی باشد"),
    ),

    bathrooms: z.preprocess(
      (value) => {
        if (value === "" || value === undefined || value === null) {
          return undefined;
        }

        return Number(value);
      },
      z
        .number({
          error: "تعداد حمام الزامی است",
        })
        .int("تعداد حمام باید عدد صحیح باشد")
        .min(0, "تعداد حمام نمی‌تواند منفی باشد"),
    ),

    parking: z.boolean(),

    floor:z.preprocess(
      (value) => {
        if (value === "" || value === undefined || value === null) {
          return undefined;
        }

        return Number(value);
      },
    
      z
      .number()
      .int("طبقه باید عدد صحیح باشد")
      .min(0, "طبقه نمی‌تواند منفی باشد")
      .optional()),

    totalFloors:z.preprocess(
      (value) => {
        if (value === "" || value === undefined || value === null) {
          return undefined;
        }

        return Number(value);
      },
    
      z
      .number()
      .int("تعداد طبقات باید عدد صحیح باشد")
      .min(1, "تعداد طبقات باید حداقل ۱ باشد")
      .optional()),

    yearBuilt:z.preprocess(
      (value) => {
        if (value === "" || value === undefined || value === null) {
          return undefined;
        }

        return Number(value);
      },
      z
      .number()
      .int("سال ساخت باید عدد صحیح باشد")
      .min(1300, "سال ساخت نامعتبر است")
      .optional()),

    location: z.object({
      province: z.string().trim().min(1, "استان الزامی است"),

      city: z.string().trim().min(1, "شهر الزامی است"),

      neighborhood: z.string().trim().optional(),

      address: z.string().trim().min(1, "آدرس الزامی است"),

      coordinates: z.object({
        lat: z.number().optional(),
        lng: z.number().optional(),
      }),
    }),

    amenities: z.object({
      elevator: z.boolean(),
      balcony: z.boolean(),
      storage: z.boolean(),
      furnished: z.boolean(),
      centralHeating: z.boolean(),
      airConditioning: z.boolean(),
    }),
  })
  .superRefine((data, ctx) => {
   
    // فروش
    if (data.transactionType === "sale") {
      
      if (data.price === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["price"],
          message: "قیمت ملک برای فروش الزامی است",
        });
      }
    }

    // اجاره
    if (data.transactionType === "rent") {
      if (data.deposit === undefined && data.rent === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["deposit"],
          message: "حداقل ودیعه یا اجاره باید وارد شود",
        });

        ctx.addIssue({
          code: "custom",
          path: ["rent"],
          message: "حداقل ودیعه یا اجاره باید وارد شود",
        });
      }
    }
  });

export default estateSchema;
