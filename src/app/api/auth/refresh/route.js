import { cookies } from "next/headers";
import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { generateAccessToken, verifyRefreshToken } from "@/utiles/auth";

export async function POST() {
  try {
    await connectToDB();

    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken");

    if (!refreshToken) {
      return Response.json(
        {
          success: false,
          message: "Refresh token not found",
        },
        { status: 401 },
      );
    }

    const tokenPayload = verifyRefreshToken(refreshToken.value);

    if (!tokenPayload?.userId) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

      return Response.json(
        {
          success: false,
          message: "Refresh token is invalid or expired",
        },
        { status: 401 },
      );
    }

    const user = await UserModel.findById(tokenPayload.userId);

    if (!user) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 },
      );
    }

    if (user.refreshToken !== refreshToken.value) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

      return Response.json(
        {
          success: false,
          message: "Refresh token is invalid",
        },
        { status: 401 },
      );
    }

    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
    });

    cookieStore.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    return Response.json({
      success: true,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh Token Error =>", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
