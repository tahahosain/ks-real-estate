import { cookies } from "next/headers";
import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { verifyAccessToken } from "@/utiles/auth";

const authUser = async () => {
  try {
    await connectToDB();

    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;

   

    if (!accessToken) {
       return null;
    }

    const tokenPayload = verifyAccessToken(accessToken);

   

    if (!tokenPayload?.userId) {
     
      return null;
    }

    const user = await UserModel.findById(
      tokenPayload.userId,
      "-password -refreshToken -__v",
    );

   

    return user;
  } catch (error) {
    console.error("Auth User Error =>", error);
    return null;
  }
};

const authAdmin = async () => {
  try {
    await connectToDB();

    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken");
;
    if (!accessToken) {
      return null;
    }

    const tokenPayload = verifyAccessToken(accessToken.value);

    if (!tokenPayload?.userId) {
      return null;
    }

    const user = await UserModel.findById(
      tokenPayload.userId,
      "-password -refreshToken -__v",
    );

    if (user?.role !== "ADMIN") {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Auth Admin Error =>", error);

    return null;
  }
};

export { authUser, authAdmin };
