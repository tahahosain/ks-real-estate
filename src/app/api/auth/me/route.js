import {authUser} from "@/utiles/auth-server";

export async function GET() {
  try {
    const user = await authUser();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "احراز هویت انجام نشده است",
        },
        { status: 401 },
      );
    }

    return Response.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Auth Me Error =>", error);

    return Response.json(
      {
        success: false,
        message: "خطایی در احراز هویت رخ داد",
      },
      { status: 500 },
    );
  }
}
