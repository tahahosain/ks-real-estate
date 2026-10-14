import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { authUser, authAdmin } from "@/utiles/auth-server";
import { validatePhone, validateEmail } from "@/utiles/auth";
import { isValidObjectId } from "mongoose";

// ========================================
// UPDATE CURRENT USER
// ========================================

export async function POST(req) {
  try {
    await connectToDB();

    const user = await authUser();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "کاربر وارد نشده است",
        },
        { status: 401 },
      );
    }

    const body = await req.json();

    const { name, email, phone } = body;

    // -------------------------
    // Validate name
    // -------------------------

    if (!name || !name.trim()) {
      return Response.json(
        {
          success: false,
          message: "نام را وارد کنید",
        },
        { status: 400 },
      );
    }

    // -------------------------
    // Validate phone
    // -------------------------

    const isValidPhone = validatePhone(phone);

    if (!isValidPhone) {
      return Response.json(
        {
          success: false,
          message: "شماره تلفن معتبر نیست",
        },
        { status: 400 },
      );
    }

    // -------------------------
    // Validate email
    // -------------------------

    if (email) {
      const isValidEmail = validateEmail(email);

      if (!isValidEmail) {
        return Response.json(
          {
            success: false,
            message: "ایمیل معتبر نیست",
          },
          { status: 400 },
        );
      }
    }

    // -------------------------
    // Update user
    // -------------------------

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        $set: {
          name: name.trim(),
          email: email?.trim() || "",
          phone,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password -refreshToken -__v");

    return Response.json(
      {
        success: true,
        message: "اطلاعات کاربر با موفقیت به‌روزرسانی شد",
        data: updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "خطا در به‌روزرسانی اطلاعات کاربر",
      },
      { status: 500 },
    );
  }
}

// ========================================
// DELETE USER - ADMIN ONLY
// ========================================

export async function DELETE(req) {
  try {
    // -------------------------
    // Check admin
    // -------------------------

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

    // -------------------------
    // Read body
    // -------------------------

    const body = await req.json();

    const { id } = body;

    // -------------------------
    // Validate id
    // -------------------------

    if (!id || !isValidObjectId(id)) {
      return Response.json(
        {
          success: false,
          message: "شناسه کاربر نامعتبر است",
        },
        { status: 400 },
      );
    }

    // -------------------------
    // Prevent admin self-delete
    // -------------------------

    if (String(admin._id) === String(id)) {
      return Response.json(
        {
          success: false,
          message: "مدیر نمی‌تواند خودش را حذف کند",
        },
        { status: 400 },
      );
    }

    // -------------------------
    // Find user
    // -------------------------

    const user = await UserModel.findById(id);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "کاربر مورد نظر پیدا نشد",
        },
        { status: 404 },
      );
    }

    // -------------------------
    // Delete user
    // -------------------------

    await UserModel.findByIdAndDelete(id);

    return Response.json(
      {
        success: true,
        message: "کاربر با موفقیت حذف شد",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "خطا در حذف کاربر",
      },
      { status: 500 },
    );
  }
}

//...................PUT.....................//
export async function PUT(req) {
 
  
 
  try {
    // =========================
    // 1. Check admin access
    // =========================
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

    // =========================
    // 2. Connect database
    // =========================
    await connectToDB();

    // =========================
    // 3. Read request body
    // =========================
    const body = await req.json();

    const { id, name, email, phone, role } = body;

    // =========================
    // 4. Validate ID
    // =========================
    if (!id || !isValidObjectId(id)) {
      return Response.json(
        {
          success: false,
          message: "شناسه کاربر نامعتبر است",
        },
        { status: 400 },
      );
    }

    // =========================
    // 5. Validate name
    // =========================
    if (!name || !name.trim()) {
      return Response.json(
        {
          success: false,
          message: "نام کاربر را وارد کنید",
        },
        { status: 400 },
      );
    }

    // =========================
    // 6. Validate phone
    // =========================
    if (!validatePhone(phone)) {
      return Response.json(
        {
          success: false,
          message: "شماره تلفن معتبر نیست",
        },
        { status: 400 },
      );
    }

    // =========================
    // 7. Validate email
    // =========================
    if (email && !validateEmail(email)) {
      return Response.json(
        {
          success: false,
          message: "ایمیل معتبر نیست",
        },
        { status: 400 },
      );
    }

    // =========================
    // 8. Validate role
    // =========================
    if (!["USER", "ADMIN"].includes(role)) {
      return Response.json(
        {
          success: false,
          message: "نقش کاربر نامعتبر است",
        },
        { status: 400 },
      );
    }

    // =========================
    // 9. Find user
    // =========================
    const user = await UserModel.findById(id);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "کاربر مورد نظر پیدا نشد",
        },
        { status: 404 },
      );
    }

    // =========================
    // 10. Prevent self role change
    // =========================
    if (String(admin._id) === String(id) && role !== admin.role) {
      return Response.json(
        {
          success: false,
          message: "نمی‌توانید نقش حساب خودتان را تغییر دهید",
        },
        { status: 400 },
      );
    }

    // =========================
    // 11. Update user
    // =========================
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: name.trim(),
          email: email?.trim() || "",
          phone,
          role,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .select("-password -refreshToken -__v")
      .lean();

    // =========================
    // 12. Response
    // =========================
    return Response.json(
    {
      success: true,
      message: "اطلاعات کاربر با موفقیت ویرایش شد",
      data: updatedUser,
    },
    { status: 200 },)
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "خطا در ویرایش اطلاعات کاربر",
      },
      { status: 500 },
    );
  }
}