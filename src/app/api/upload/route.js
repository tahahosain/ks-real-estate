import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "@/utiles/dashboard/s3";
import crypto from "crypto";
import { authAdmin } from "@/utiles/auth-server";
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    // -------------------------
    // 1. بررسی وجود فایل
    // -------------------------

    if (!file) {
      return Response.json(
        {
          success: false,
          message: "فایلی ارسال نشده است",
        },
        { status: 400 },
      );
    }

    // -------------------------
    // 2. بررسی نوع فایل
    // -------------------------

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        {
          success: false,
          message: "فرمت تصویر مجاز نیست. فقط JPG، PNG و WEBP مجاز هستند.",
        },
        { status: 400 },
      );
    }

    // -------------------------
    // 3. بررسی حجم فایل
    // -------------------------

    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      return Response.json(
        {
          success: false,
          message: "حجم تصویر نباید بیشتر از 5 مگابایت باشد.",
        },
        { status: 400 },
      );
    }

    // -------------------------
    // 4. تبدیل فایل به Buffer
    // -------------------------

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // -------------------------
    // 5. ساخت نام فایل
    // -------------------------

    const extension = file.name.split(".").pop().toLowerCase();

    const fileName = `${crypto.randomUUID()}.${extension}`;

    // -------------------------
    // 6. آپلود به Parspack
    // -------------------------

    const command = new PutObjectCommand({
      Bucket: process.env.PARSPACK_BUCKET,
      Key: `estates/${fileName}`,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // -------------------------
    // 7. پاسخ موفق
    // -------------------------

    return Response.json({
      success: true,
      message: "تصویر با موفقیت آپلود شد",
      fileName,
      key: `estates/${fileName}`,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "خطا در آپلود تصویر",
      },
      { status: 500 },
    );
  }
}
//.............DELETE....................//
export async function DELETE(req) {
  try {
    const admin = await authAdmin();

    if (!admin) {
      return Response.json(
        {
          success: false,
          message: "دسترسی غیرمجاز است",
        },
        { status: 403 },
      );
    }

    const { key } = await req.json();

    if (!key) {
      return Response.json(
        {
          success: false,
          message: "مسیر فایل ارسال نشده است",
        },
        { status: 400 },
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.PARSPACK_BUCKET,
      Key: key,
    });

    await s3Client.send(command);

    return Response.json({
      success: true,
      message: "تصویر با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("DELETE UPLOAD ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "خطا در حذف تصویر",
      },
      { status: 500 },
    );
  }
}