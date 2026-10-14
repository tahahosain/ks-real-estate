
import EstateModel from "@/models/Estate";
import UserModel from "@/models/User";

export async function getAdminDashboardData() {
  const [
    totalEstates,
    availableEstates,
    reservedEstates,
    soldEstates,
    rentedEstates,
    featuredEstates,
    totalUsers,
    estatesViews,
    latestEstates,
  ] = await Promise.all([
    EstateModel.countDocuments(),

    EstateModel.countDocuments({
      status: "available",
    }),

    EstateModel.countDocuments({
      status: "reserved",
    }),

    EstateModel.countDocuments({
      status: "sold",
    }),

    EstateModel.countDocuments({
      status: "rented",
    }),

    EstateModel.countDocuments({
      isFeatured: true,
    }),

    UserModel.countDocuments(),

    EstateModel.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$views",
          },
        },
      },
    ]),

    EstateModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "title type transactionType status price rent area location thumbnail createdAt"
      )
      .lean(),
  ]);

  return {
    stats: {
      totalEstates,
      availableEstates,
      reservedEstates,
      soldEstates,
      rentedEstates,
      featuredEstates,
      totalUsers,
      totalViews: estatesViews[0]?.total || 0,
    },

    latestEstates,
  };
}
;
