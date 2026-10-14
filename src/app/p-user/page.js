import { redirect } from "next/navigation";
import { authUser } from "@/utiles/auth-server";
import connectToDB from "@/configs/db";
import WishlistModel from "@/models/Wishlist";
import UserDashboard from "@/components/p-user/UserDashboard";
import EstateModel from "@/models/Estate";
export default async function UserPage() {
  const user = await authUser();

  if (!user) {
    redirect("/login-register");
  }

  await connectToDB();
//.........resive wishlist.....................//
  const wishlist = await WishlistModel.find({
    user: user._id,
  })
    .populate("estate")
    .sort({ createdAt: -1 })
    .lean();

  const properties = wishlist
    .filter((item) => item.estate)
    .map((item) => JSON.parse(JSON.stringify(item.estate)));
  //................... myestates......................//
const myEstates = await EstateModel.find({
  owner: user._id,
})
  .sort({ createdAt: -1 })
  .lean();

  const submittedProperties = JSON.parse(JSON.stringify(myEstates));
  
  return (
    <UserDashboard
      user={JSON.parse(JSON.stringify(user))}
      properties={properties}
      submittedProperties={submittedProperties}
    />
  );
}
