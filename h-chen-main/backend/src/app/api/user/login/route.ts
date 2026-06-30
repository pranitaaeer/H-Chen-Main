import { connectToMongoDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    await connectToMongoDB();

    const { email, password } = await request.json();

    let user = await User.findOne({ email }).select("+password");
    if (!user) return new NextResponse("Invalid Credentials!", { status: 404 });
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return new NextResponse("Invalid Credentials!", { status: 404 });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const token = jwt.sign({ id: user._id, email: user.email }, secret, {
      expiresIn: "1d",
    });

    const userWithWishlist = await User.aggregate([
      {
        $match: { _id: new Types.ObjectId(user._id) },
      },
      {
        $lookup: {
          from: "products", // collection name in lowercase
          localField: "wishlist_products",
          foreignField: "_id",
          as: "wishlist_product_details",
        },
      },
    ]);
    user = userWithWishlist[0];
    return NextResponse.json(
      { message: "Login successful!", user, token },
      { status: 200 }
    );
  } catch (error) {
    // console.log(error);
    return new NextResponse("Internal Server Error!", { status: 500 });
  }
};
