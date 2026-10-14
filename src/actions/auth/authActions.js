"use server";

import connectToDB from "@/configs/db";
import OtpModel from "@/models/Otp";
import UserModel from "@/models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/utiles/auth";
import { roles } from "@/utiles/Constants";
import { cookies } from "next/headers";
import { success } from "zod";

const sendOtp = async ({ phone, mode }) => {
  try {
    await connectToDB();

    // فقط برای ثبت نام
    if (mode === "register") {
      const existingUser = await UserModel.findOne({ phone });

      if (existingUser) {
        return {
          success: false,
          message: "این شماره موبایل قبلاً ثبت شده است",
        };
      }
    }

    // تولید OTP پنج رقمی
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    // اعتبار 5 دقیقه
    const expTime = Date.now() + 300_000;

    // ارسال SMS
    const response = await fetch("http://ippanel.com/api/select", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        op: "pattern",
        user: process.env.IPPANEL_USER,
        pass: process.env.IPPANEL_PASSWORD,
        fromNum: process.env.IPPANEL_FROM_NUMBER,
        toNum: phone,
        patternCode: process.env.IPPANEL_PATTERN_CODE,
        inputData: [
          {
            "verification-code": code,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("IPPANEL Error:", await response.text());

      return {
        success: false,
        message: "ارسال کد تأیید با مشکل مواجه شد",
      };
    }

    // حذف OTP قبلی این شماره
    await OtpModel.deleteMany({ phone });

    // ذخیره OTP جدید
    await OtpModel.create({
      phone,
      code,
      expTime,
    });

    return {
      success: true,
      message: "کد تأیید با موفقیت ارسال شد",
    };
  } catch (error) {
    console.error("sendOtp error =>", error);

    return {
      success: false,
      message: "خطایی در ارسال کد تأیید رخ داد",
    };
  }
};

const verifyOtp = async ({ phone, code, mode, name, email }) => {
  try {
    await connectToDB();

    const otp = await OtpModel.findOneAndUpdate(
      { phone },
      {
        $inc: {
          times: 1,
        },
      },
      {
        new: true,
      },
    );

    if (!otp) {
      return {
        success: false,
        message: "کدی برای این شماره پیدا نشد",
      };
    }

    if (otp.expTime <= Date.now()) {
      await OtpModel.findByIdAndDelete(otp._id);

      return {
        success: false,
        message: "کد تأیید منقضی شده است",
      };
    }

    if (otp.times > 3) {
      await OtpModel.findByIdAndDelete(otp._id);

      return {
        success: false,
        message: "تعداد تلاش‌های مجاز به پایان رسیده است",
      };
    }

    if (otp.code !== code) {
      return {
        success: false,
        message: "کد تأیید صحیح نیست",
      };
    }

    let user = await UserModel.findOne({ phone });

    // LOGIN
    if (mode === "login") {
      if (!user) {
        return {
          success: false,
          message: "کاربر پیدا نشد",
        };
      }
    }

    // REGISTER
    if (mode === "register") {
      if (user) {
        return {
          success: false,
          message: "این شماره موبایل قبلاً ثبت شده است",
        };
      }

      const usersCount = await UserModel.countDocuments();

      user = await UserModel.create({
        name,
        phone,
        email: email || undefined,
        role: usersCount > 0 ? roles.USER : roles.ADMIN,
      });
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
    });

    await UserModel.findByIdAndUpdate(user._id, {
      refreshToken,
    });

    await OtpModel.findByIdAndDelete(otp._id);

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 24 * 60 * 60,
    });

    return {
      success: true,
      message:
        mode === "login"
          ? "ورود با موفقیت انجام شد"
          : "ثبت نام با موفقیت انجام شد",
    };
  } catch (error) {
    console.error("verifyOtp error =>", error);

    return {
      success: false,
      message: "خطایی در تأیید کد رخ داد",
    };
  }
};

//...................refreshToken Handeling................//

const refreshAccessToken = async () => {
  try {
    await connectToDB();

    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken");

    if (!refreshToken) {
      return {
        success: false,
        message: "Refresh token not found",
      };
    }

    const tokenPayload = verifyRefreshToken(refreshToken.value);

    if (!tokenPayload?.userId) {
       cookieStore.delete("accessToken");
       cookieStore.delete("refreshToken");
      return {
        success: false,
        message: "Refresh token is invalid or expired",
      };
    }

    const user = await UserModel.findById(tokenPayload.userId);

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    if (user.refreshToken !== refreshToken.value) {
      return {
        success: false,
        message: "Refresh token is invalid",
      };
    }

    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
    });

    cookieStore.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    return {
      success: true,
      message: "Access token refreshed successfully",
    };
  } catch (error) {
    console.error("Refresh Token Error =>", error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

//...............LogOut.......................//
const logout = async () => {
  try {
    await connectToDB();

    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken");

    if (refreshToken) {
      await UserModel.findOneAndUpdate(
        {
          refreshToken: refreshToken.value,
        },
        {
          $unset: {
            refreshToken: 1,
          },
        },
      );
    }

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return {
      success: true,
      message: "با موفقیت از حساب کاربری خارج شدید",
    };
  } catch (error) {
    console.error("Logout Error =>", error);

    return {
      success: false,
      message: "خطایی هنگام خروج از حساب رخ داد",
    };
  }
};

export { sendOtp, verifyOtp, refreshAccessToken, logout };
