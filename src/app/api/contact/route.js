import connectToDB from "@/configs/db";
import ContactMessageModel from "@/models/ContactMessage";
import { validatePhone } from "@/utiles/auth";
import { authAdmin } from "@/utiles/auth-server";

export async function POST(req) {
  try {
    await connectToDB();

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
    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return Response.json(
        {
          success: false,
          message: "شماره تماس معتبر نیست",
        },
        { status: 400 },
      );
    }
    const contactMessage = await ContactMessageModel.create({
      name,
      email,
      phone,
      message,
    });

    return Response.json(
      {
        success: true,
        message: "پیام شما با موفقیت ارسال شد",
        data: contactMessage,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact API Error =>", error);

    return Response.json(
      {
        success: false,
        message: "خطایی در ارسال پیام رخ داد",
      },
      { status: 500 },
    );
  }
}
//.....................GET.........................//

export async function GET() {
  try {
    await connectToDB();

    const admin = await authAdmin();

    if (!admin) {
      return Response.json(
        {
          success: false,
          message: "فقط مدیر می‌تواند به پیام‌ها دسترسی داشته باشد",
        },
        { status: 403 },
      );
    }

    const count = await ContactMessageModel.countDocuments({
      isRead:false
    });

    return Response.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Contact API Error =>", error);

    return Response.json(
      {
        success: false,
        message: "خطایی در دریافت تعداد پیام رخ داد",
      },
      { status: 500 },
    );
  }
}