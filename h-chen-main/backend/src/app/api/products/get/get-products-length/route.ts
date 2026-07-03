import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await connectToMongoDB();

    const count = await Products.countDocuments({}); // always safe

    return NextResponse.json({
      success: true,
      count,
    });
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