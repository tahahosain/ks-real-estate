import { authUser } from "@/utiles/auth-server";
import WishlistModel from "@/models/Wishlist";
import connectToDB from "@/configs/db";

export async function DELETE(req, { params }) {
  try {
    await connectToDB();

    const user = await authUser();

    if (!user) {
      return Response.json(
        { message: "please login first ..." },
        { status: 401 },
      );
    }

    const { id } = await params;

    const wishlist = await WishlistModel.findOneAndDelete({
      user: user._id,
      estate: id,
    });

    if (!wishlist) {
      return Response.json(
        { message: "این ملک در علاقه‌مندی‌ها وجود ندارد" },
        { status: 404 },
      );
    }

    return Response.json(
      { message: "ملک با موفقیت از علاقه‌مندی‌ها حذف شد" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);

    return Response.json({ message: "خطای سرور" }, { status: 500 });
  }
}
