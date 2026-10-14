import mongoose from "mongoose";

import connectToDB from "@/configs/db";
import ContactMessageModel from "@/models/ContactMessage";
import { authAdmin } from "@/utiles/auth-server";

export async function DELETE(req, { params }) {
  try {
    await connectToDB();

    const admin = await authAdmin();

    if (!admin) {
      return Response.json(
        {
          success: false,
          message: "فقط مدیر می‌تواند پیام‌ها را حذف کند",
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

    const deletedMessage = await ContactMessageModel.findByIdAndDelete(id);

    if (!deletedMessage) {
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
      message: "پیام با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Delete Contact Message Error =>", error);

    return Response.json(
      {
        success: false,
        message: "خطا در حذف پیام",
      },
      { status: 500 },
    );
  }
}

//.............................PUT..........................//
export async function PUT(req, { params }) {
  try {
    await connectToDB();

    const admin = await authAdmin();

    if (!admin) {
      return Response.json(
        {
          success: false,
          message: "فقط مدیر می‌تواند پیام را ویرایش کند",
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

    const body = await req.json();

    const { name, email, phone, message } = body;

    if (!phone || !message) {
      return Response.json(
        {
          success: false,
          message: "شماره تماس و پیام الزامی هستند",
        },
        { status: 400 },
      );
    }

    const updatedMessage = await ContactMessageModel.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        message,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedMessage) {
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
      message: "پیام با موفقیت ویرایش شد",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Update Contact Message Error =>", error);

    return Response.json(
      {
        success: false,
        message: "خطا در ویرایش پیام",
      },
      { status: 500 },
    );
  }
}