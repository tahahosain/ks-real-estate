import { NextResponse } from "next/server";

import connectToDB from "@/configs/db";
import EstateModel from "@/models/Estate";

export async function GET(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه ملک ارسال نشده است",
        },
        { status: 400 },
      );
    }

    const currentEstate = await EstateModel.findById(id).lean();

    if (!currentEstate) {
      return NextResponse.json(
        {
          success: false,
          message: "ملک مورد نظر پیدا نشد",
        },
        { status: 404 },
      );
    }

    const similarEstates = await EstateModel.find({
      _id: { $ne: currentEstate._id },

      type: currentEstate.type,

      transactionType: currentEstate.transactionType,

      status: "available",

      area: {
        $gte: currentEstate.area * 0.7,
        $lte: currentEstate.area * 1.3,
      },
    })
      .sort({
        isFeatured: -1,
        createdAt: -1,
      })
      .limit(6)
      .lean();

    return NextResponse.json({
      success: true,
      data: similarEstates,
    });
  } catch (error) {
    console.error("GET SIMILAR ESTATES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت املاک مشابه",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
