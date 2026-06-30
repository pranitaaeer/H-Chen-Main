import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToMongoDB } from "@/lib/db";
import Order from "@/models/Order";
import { Types } from "mongoose";

export const GET = async (
  request: NextRequest,
  { params: { orderId } }: { params: { orderId: string } }
) => {
  try {
    await connectToMongoDB();

    // const order = await Order.findById(orderId);

    const order = await Order.aggregate([
      {
        $match: { _id: new Types.ObjectId(orderId) },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "items.product",
        },
      },
      {
        $unwind: "$items.product",
      },
      {
        $lookup: {
          from: "addresses", // Make sure this is your actual address collection name
          localField: "address",
          foreignField: "_id",
          as: "address",
        },
      },
      {
        $unwind: "$address",
      },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          address: { $first: "$address" },
          billingMethod: { $first: "$billingMethod" },
          totalPrice: { $first: "$totalPrice" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          items: {
            $push: {
              _id: "$items._id",
              quantity: "$items.quantity",
              product: "$items.product",
            },
          },
        },
      }
    ]);

    if (!order) {
      revalidatePath(request.url);
      return NextResponse.json({
        status: 404,
        message: "No User Orders found!",
      });
    }

    revalidatePath(request.url);
    return NextResponse.json(order[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    revalidatePath(request.url);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
};
