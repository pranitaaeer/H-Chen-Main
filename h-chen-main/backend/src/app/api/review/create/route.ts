import { connectToMongoDB } from "@/lib/db";
import Review from "@/models/Review";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectToMongoDB();
    const body = await req.json();
    const { product, user, rating, description } = body;

    if (!product || !user || !rating || !description) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const review = new Review({
      product,
      user,
      rating,
      description,
    });
    await review.save();

    // const allRatings = await Review.find({ product: new Types.ObjectId(product)})
    const allRatings = await Review.aggregate([
      {
        $match: { product: new Types.ObjectId(product) },
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

    return NextResponse.json(allRatings);
  } catch (error) {
    console.error("Error in creating review: ", error);
    return NextResponse.json(
      { message: "Error in creating review" },
      { status: 500 }
    );
  }
};
