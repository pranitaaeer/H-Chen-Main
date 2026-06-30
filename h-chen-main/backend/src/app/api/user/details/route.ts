import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectToMongoDB } from "@/lib/db";
import { Types } from "mongoose";

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    // console.log("decoded, ", decoded);

    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    connectToMongoDB();

    let user = await User.aggregate([
      {
        $match: { _id: new Types.ObjectId(decoded.id) },
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
    user = user[0]
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
