import { authUser } from "@/utils/auth-server";
import { validatePhone, validateEmail } from "@/utils/auth";
import connectToDB from "@/configs/db";
import BanModel from '@/models/Ban'

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { email, phone } = body;

    const user = await authUser();
    if (!user) {
      return Response.json({ message: "user not found" }, { status: 404 });
    }

    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return Response.json({ message: "inter your neme" }, { status: 401 });
      };
    if (email) {
      const isValidEmail = validateEmail(email);
      if (!isValidEmail) {
        return Response.json({ message: "inter your neme" }, { status: 401 });
      }
      };

      await BanModel.create({ email, phone });


    return Response.json(
      { message: " user Ban successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("error =>", error);

    return Response.json({ message: error }, { status: 500 });
  }
}
