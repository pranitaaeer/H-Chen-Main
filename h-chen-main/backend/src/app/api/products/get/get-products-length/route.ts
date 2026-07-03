import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";

export async function GET() {
  try {
    await connectToMongoDB();

    const count = await Products.countDocuments();

    return NextResponse.json(
      {
        success: true,
        count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products count:", error);

    return NextResponse.json(
      {
        success: false,
        count: 0,
      },
      { status: 500 }
    );
  }
}