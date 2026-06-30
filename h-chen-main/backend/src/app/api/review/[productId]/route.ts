import { connectToMongoDB } from "@/lib/db";
import Review from "@/models/Review";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    await connectToMongoDB();

    const { productId } = params;
    const allRatings = await Review.aggregate([
      {
        $match: { product: new Types.ObjectId(productId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user", // because $lookup returns an array
      },
      {
        $project: {
          _id: 1,
          rating: 1,
          description: 1,
          createdAt: 1,
          updatedAt: 1,
          product: 1,
          user: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            profile_image: 1,
            country: 1,
            email: 1,
          },
        },
      },
    ]);

    return NextResponse.json(allRatings)
  } catch (error) {
    console.error("Error in GET /api/products/:productId", error);
    return NextResponse.json(
      { message: "Error in fetching Rviews: ", error },
      { status: 500 }
    );
  }
};
