import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import NewArrivalProducts from "@/models/NewArrivalProducts";

export async function GET() {
  try {
    await connectToMongoDB();

   
    
      const newArrivalProducts = await NewArrivalProducts.find().sort({ index: 1 });
    return NextResponse.json(
      {
        success: true,
        newArrivalProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch new arrival products",
      },
      { status: 500 }
    );
  }
}