import { NextResponse } from "next/server";

import connectToDB from "@/configs/db";
import EstateModel from "@/models/Estate";
import { slugify } from "@/utiles/dashboard/slugify";
import estateSchema from "@/validators/estateSchema";
import { authUser, authAdmin } from "@/utiles/auth-server";
export async function POST(req) {
  try {
    await connectToDB();
const user = await authUser();

if (!user) {
  return Response.json(
    {
      success: false,
      message: "برای ثبت ملک ابتدا وارد حساب کاربری شوید",
    },
    { status: 401 },
  );
}

const isAdmin = user.role === "ADMIN";
    const body = await req.json();

    // 1. Validation
    const validationResult = estateSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          success: false,
          message: "اطلاعات ملک نامعتبر است",
          errors: validationResult.error.flatten(),
        },
        { status: 400 },
      );
    }

    // 2. Data after validation
    const validatedData = validationResult.data;

    // 3. Generate slug
    const baseSlug = slugify(validatedData.title);

    let slug = baseSlug;
    let counter = 1;

    while (await EstateModel.exists({ slug })) {
      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }

    // 4. Create estate
    const estate = await EstateModel.create({
      ...validatedData,
      status: isAdmin ? "available" : "pending",
      owner: isAdmin ? undefined : user._id,

      images: body.images || [],
      thumbnail: body.thumbnail || "",

      slug,
    });

    return NextResponse.json(
      {
        success: true,
        message: "ملک با موفقیت ثبت شد",
        estate,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("CREATE PROPERTY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ثبت ملک",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}



export async function GET(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);

    // =========================
    // Filters
    // =========================

    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const transactionType = searchParams.get("transactionType");
    const city = searchParams.get("city");
    const status = searchParams.get("status");
    const includePending = searchParams.get("includePending") === "true";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const minArea = searchParams.get("minArea");
    const maxArea = searchParams.get("maxArea");

    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");

    const parking = searchParams.get("parking");
    const sort = searchParams.get("sort") || "newest";
    // =========================
    // Pagination
    // =========================

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 6, 1),
      50,
    );

    const skip = (page - 1) * limit;

    // =========================
    // MongoDB Query
    // =========================

    const query = {};
    let sortQuery = { createdAt: -1 };

    switch (sort) {
      case "price-asc":
        sortQuery = { price: 1 };
        break;

      case "price-desc":
        sortQuery = { price: -1 };
        break;

      case "bedrooms-asc":
        sortQuery = { bedrooms: 1 };
        break;

      case "bedrooms-desc":
        sortQuery = { bedrooms: -1 };
        break;

      case "area-asc":
        sortQuery = { area: 1 };
        break;

      case "area-desc":
        sortQuery = { area: -1 };
        break;

      case "address-asc":
        sortQuery = {
          "location.address": 1,
        };
        break;

      case "address-desc":
        sortQuery = {
          "location.address": -1,
        };
        break;

      case "newest":
      default:
        sortQuery = {
          createdAt: -1,
        };
        break;
    }
    // Search title
    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Property type
    if (type) {
      query.type = type;
    }

    // Sale / Rent
    if (transactionType) {
      query.transactionType = transactionType;
    }
    // Status
    // Status
    if (status) {
      query.status = status;
    } else if (!includePending) {
      query.status = { $ne: "pending" };
    }
    // City
    if (city) {
      query["location.city"] = city;
    }

    // Price
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Area
    if (minArea || maxArea) {
      query.area = {};

      if (minArea) {
        query.area.$gte = Number(minArea);
      }

      if (maxArea) {
        query.area.$lte = Number(maxArea);
      }
    }

    // Bedrooms
    if (bedrooms) {
      query.bedrooms = {
        $gte: Number(bedrooms),
      };
    }

    // Bathrooms
    if (bathrooms) {
      query.bathrooms = {
        $gte: Number(bathrooms),
      };
    }

    // Parking
    if (parking === "true") {
      query.parking = true;
    }

    // =========================
    // Get data
    // =========================

    const [estates, total] = await Promise.all([
      EstateModel.find(query).sort(sortQuery).skip(skip).limit(limit).lean(),

      EstateModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,

      data: estates,

      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("GET PROPERTIES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت املاک",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}