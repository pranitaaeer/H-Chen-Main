import { connectToMongoDB } from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string } }
) => {
  try {
    connectToMongoDB();

    let userWithWishlist = await Wishlist.aggregate([
      {
        $match: { user: new Types.ObjectId(params.userId) },
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "products", // collection name in lowercase
          localField: "products",
          foreignField: "_id",
          as: "wishlist_product_details",
        },
      },
      { $unwind: "$wishlist_product_details" },
      {
        $group: {
          _id: "$_id",
          products: { $push: "$products" },
          wishlist_product_details: { $push: "$wishlist_product_details" },
        },
      },
    ]);
    // console.log(userWithWishlist);
    if (!userWithWishlist[0]?.products) {
      userWithWishlist = await Wishlist.find({ user: params.userId });
    }
    return NextResponse.json({ user: userWithWishlist[0] }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error in fetching wishlist" },
      { status: 500 }
    );
  }
};
