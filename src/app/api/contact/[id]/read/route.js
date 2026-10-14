import mongoose from "mongoose";
import connectToDB from "@/configs/db";
import ContactMessageModel from "@/models/ContactMessage";
import { authAdmin } from "@/utiles/auth-server";

export async function PATCH(req, { params }) {
  try {
    await connectToDB();

    const admin = await authAdmin();

    if (!admin) {
      return Response.json(
        {
          success: false,
          message: "فقط مدیر می‌تواند پیام را مشاهده کند",
        },
        { status: 403 },
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "شناسه پیام نامعتبر است",
        },
        { status: 400 },
      );
    }

    const message = await ContactMessageModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );

    if (!message) {
      return Response.json(
        {
          success: false,
          message: "پیام پیدا نشد",
        },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "پیام به عنوان خوانده‌شده علامت خورد",
      data: message,
    });
  } catch (error) {
    console.error("Read Contact Message Error =>", error);

    return Response.json(
      {
        success: false,
        message: "خطا در تغییر وضعیت پیام",
      },
      { status: 500 },
    );
  }
}
