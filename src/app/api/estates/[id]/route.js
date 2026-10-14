import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "@/utiles/dashboard/s3";
import { authAdmin } from "@/utiles/auth-server";
import estateSchema from "@/validators/estateSchema";
import connectToDB from "@/configs/db";
import EstateModel from "@/models/Estate";
//..................GET.........................//
export async function GET(request, { params }) {
  try {
    await connectToDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه ملک نامعتبر است",
        },
        { status: 400 },
      );
    }

    const estate = await EstateModel.findById(id).lean();

    if (!estate) {
      return NextResponse.json(
        {
          success: false,
          message: "ملک مورد نظر پیدا نشد",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: estate,
    });
  } catch (error) {
    console.error("GET ESTATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت اطلاعات ملک",
      },
      { status: 500 },
    );
  }
}
//.........................PUT............................//


export async function PUT(req, { params }) {
  try {
    // =========================
    // 1. Check admin access
    // =========================
    const admin = await authAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "دسترسی غیرمجاز است",
        },
        { status: 403 },
      );
    }

    // =========================
    // 2. Validate estate id
    // =========================
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه ملک نامعتبر است",
        },
        { status: 400 },
      );
    }

    // =========================
    // 3. Read request body
    // =========================
    const body = await req.json();
    // =========================
    // Approval action
    // =========================
    if (body.action === "approve") {
      await connectToDB();

      const estate = await EstateModel.findById(id);

      if (!estate) {
        return NextResponse.json(
          {
            success: false,
            message: "ملک مورد نظر پیدا نشد",
          },
          { status: 404 },
        );
      }

      // فقط ملک‌های pending قابل تأیید هستند
      if (estate.status !== "pending") {
        return NextResponse.json(
          {
            success: false,
            message: "این ملک در وضعیت انتظار تأیید نیست",
          },
          { status: 400 },
        );
      }

      estate.status = "available";

      await estate.save();

      return NextResponse.json({
        success: true,
        message: "ملک با موفقیت تأیید شد",
        data: estate,
      });
    }

    // =========================
    // Reject action
    // =========================
    if (body.action === "reject") {
      await connectToDB();

      const estate = await EstateModel.findById(id);

      if (!estate) {
        return NextResponse.json(
          {
            success: false,
            message: "ملک مورد نظر پیدا نشد",
          },
          { status: 404 },
        );
      }

      // فقط ملک‌های pending قابل رد شدن هستند
      if (estate.status !== "pending") {
        return NextResponse.json(
          {
            success: false,
            message: "این ملک در وضعیت انتظار تأیید نیست",
          },
          { status: 400 },
        );
      }

      estate.status = "rejected";

      await estate.save();

      return NextResponse.json({
        success: true,
        message: "ملک با موفقیت رد شد",
        data: estate,
      });
    }
    // =========================
    // reconsider action
    // =========================

    if (body.action === "reconsider") {
      await connectToDB();

      const estate = await EstateModel.findById(id);

      if (!estate) {
        return NextResponse.json(
          {
            success: false,
            message: "ملک مورد نظر پیدا نشد",
          },
          { status: 404 },
        );
      }

      if (estate.status !== "rejected") {
        return NextResponse.json(
          {
            success: false,
            message: "این ملک در وضعیت ردشده نیست",
          },
          { status: 400 },
        );
      }

      estate.status = "pending";

      await estate.save();

      return NextResponse.json({
        success: true,
        message: "ملک برای بررسی مجدد به صف انتظار بازگشت",
        data: estate,
      });
    }

    // =========================
    // 4. Validate data with Zod
    // =========================
    const validationResult = estateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "اطلاعات ملک نامعتبر است",
          errors: validationResult.error.flatten(),
        },
        { status: 400 },
      );
    }

    const validatedData = validationResult.data;

    // =========================
    // 5. Connect to database
    // =========================
    await connectToDB();

    // =========================
    // 6. Find existing estate
    // =========================
    const estate = await EstateModel.findById(id);

    if (!estate) {
      return NextResponse.json(
        {
          success: false,
          message: "ملک مورد نظر پیدا نشد",
        },
        { status: 404 },
      );
    }

    // =========================
    // 7. Prepare safe update data
    // =========================
    const updateData = {
      ...validatedData,

      // Images are managed by EditEstateForm
      images: body.images || [],

      // First image as thumbnail
      thumbnail: body.thumbnail || "",

      // Keep the existing slug
      slug: estate.slug,
    };

    // =========================
    // 8. Update estate
    // =========================
    const updatedEstate = await EstateModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    // =========================
    // 9. Return response
    // =========================
    return NextResponse.json({
      success: true,
      message: "ملک با موفقیت ویرایش شد",
      data: updatedEstate,
    });
  } catch (error) {
    console.error("UPDATE ESTATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ویرایش ملک",
      },
      { status: 500 },
    );
  }
}
//.................DELETE..................//

export async function DELETE(req, { params }) {
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

    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          success: false,
          message: "شناسه ملک ارسال نشده است",
        },
        { status: 400 },
      );
    }

    await connectToDB();

    const estate = await EstateModel.findById(id);

    if (!estate) {
      return Response.json(
        {
          success: false,
          message: "ملک پیدا نشد",
        },
        { status: 404 },
      );
    }

    const images = estate.images || [];

    for (const image of images) {
      if (!image.publicId) continue;

      const command = new DeleteObjectCommand({
        Bucket: process.env.PARSPACK_BUCKET,
        Key: image.publicId,
      });

      await s3Client.send(command);
    }

    await EstateModel.findByIdAndDelete(id);

    return Response.json({
      success: true,
      message: "ملک و تصاویر آن با موفقیت حذف شدند",
    });
  } catch (error) {
    console.error("DELETE ESTATE ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "خطا در حذف ملک",
      },
      { status: 500 },
    );
  }
}
