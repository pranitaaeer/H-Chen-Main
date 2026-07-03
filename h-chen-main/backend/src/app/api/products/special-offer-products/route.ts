import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import SpecialOfferProducts from "@/models/SpecialOfferProducts";

export async function GET() {
  try {
    await connectToMongoDB();

    const products = await SpecialOfferProducts.find()
      .populate("product")
      .sort({ index: 1 });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch special offer products",
      },
      { status: 500 }
    );
  }
}