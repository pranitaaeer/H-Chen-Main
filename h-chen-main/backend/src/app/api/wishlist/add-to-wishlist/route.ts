import { connectToMongoDB } from "@/lib/db";
import User from "@/models/User";
import Wishlist from "@/models/Wishlist";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { userId, productId } = body;

    connectToMongoDB()

    if (!userId || !productId) {
      return NextResponse.json("Invalid request", { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    let wishlist = await Wishlist.findOne({user: userId});
    if ( !wishlist ){
      wishlist = new Wishlist({user: userId});
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }
    await wishlist.save();

    const userWithWishlist = await Wishlist.aggregate([
      {
        $match: { user: new Types.ObjectId(userId) },
      },
      {
        $unwind: "$products"
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
    return NextResponse.json({user: userWithWishlist[0]}, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error in adding to wishlist" },
      { status: 500 }
    );
  }
};
