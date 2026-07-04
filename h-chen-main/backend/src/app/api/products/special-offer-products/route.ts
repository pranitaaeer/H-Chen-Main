import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import SpecialOfferProducts from "@/models/SpecialOfferProducts";

export async function GET() {
  try {
    await connectToMongoDB();

    const specialOfferProducts = await SpecialOfferProducts.find().sort({ index: 1 });
     
    return NextResponse.json(
      {
        success: true,
        specialOfferProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching special offer products:", error);

    return NextResponse.json(
      {
        success: false,
        specialOfferProducts: [],
        message: "Failed to fetch special offer products",
      },
      { status: 500 }
    );
  }
}