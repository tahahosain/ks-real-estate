import mongoose from "mongoose";

import connectToDB from "@/configs/db";
import WishlistModel from "@/models/Wishlist";
import EstateModel from "@/models/Estate";
import { authUser } from "@/utiles/auth-server";

export async function POST(req) {
  try {
    await connectToDB();

    // پیدا کردن کاربر از روی token
    const user = await authUser();

    if (!user) {
      return Response.json({ message: "کاربر وارد نشده است" }, { status: 401 });
    }

    const body = await req.json();
    const { estate } = body;
    if (!estate) {
      return Response.json(
        { message: "آی‌دی ملک ارسال نشده است" },
        { status: 400 },
      );
    }
    // validation
    if (!mongoose.Types.ObjectId.isValid(estate)) {
      return Response.json(
        { message: "آی‌دی ملک نامعتبر است" },
        { status: 400 },
      );
    }

    // بررسی وجود ملک
    const estateDoc = await EstateModel.findById(estate);

    if (!estateDoc) {
      return Response.json({ message: "ملک پیدا نشد" }, { status: 404 });
    }

    // بررسی تکراری نبودن Wishlist
    const wishlist = await WishlistModel.findOne({
      user: user._id,
      estate,
    });

    if (wishlist) {
      return Response.json(
        { message: "این ملک قبلاً به علاقه‌مندی‌ها اضافه شده است" },
        { status: 409 },
      );
    }

    // ایجاد Wishlist
    await WishlistModel.create({
      user: user._id,
      estate,
    });

    return Response.json(
      { message: "ملک با موفقیت به علاقه‌مندی‌ها اضافه شد" },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);

    return Response.json({ message: "خطای سرور" }, { status: 500 });
  }
}

//...............GET..........................//


export async function GET() {
  try {
    await connectToDB();

    const user = await authUser();

    if (!user) {
      return Response.json({ message: "کاربر وارد نشده است" }, { status: 401 });
    }

    const wishlist = await WishlistModel.find({
      user: user._id,
    })
      .select("estate")
      .lean();

    const estateIds = wishlist.map((item) => item.estate.toString());

    return Response.json({
      success: true,
      favorites: estateIds,
    });
  } catch (error) {
    console.error("Wishlist GET Error =>", error);

    return Response.json({ message: "خطای سرور" }, { status: 500 });
  }
}