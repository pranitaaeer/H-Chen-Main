import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";

export async function GET(req: NextRequest) {
  try {
    await connectToMongoDB();

    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const color = searchParams.get("color");
    const size = searchParams.get("size");
    const search = searchParams.get("search");
    const min = searchParams.get("priceMin");
    const max = searchParams.get("priceMax");
    const sortBy = searchParams.get("sortBy");
    const limit = searchParams.get("limit") || 12;

    const filter: any = {};

    if (category) filter.category = { $regex: category, $options: "i" };
    if (color) {
      filter.colors = { $elemMatch: { $regex: new RegExp(color, "i") } };
    }
    if (size) {
      filter.sizes = { $elemMatch: { $regex: new RegExp(size, "i") } };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (min && max) {
      filter.price = {
        $gte: parseFloat(min),
        $lte: parseFloat(max),
      };
    }

    // console.log("Filter criteria:", filter);

    let sort = {};
    switch (sortBy) {
      case "price-low":
        sort = { salePrice: 1 };
        break;
      case "price-high":
        sort = { salePrice: -1 };
        break;

      default:
        sort = { createdAt: -1 };
        break;
    }

    const products = await Products.find(filter)
      .sort(sort)
      .limit(Number(limit));

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
