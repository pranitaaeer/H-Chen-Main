import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectToMongoDB } from "@/lib/db";
import Coupnon from "@/models/Coupon";

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB();
    const body = await request.json();

    if (body.coupon) {
      await Coupnon.findByIdAndUpdate(body.coupon, {
        $inc: { quantity: -1 },
        $push: { usedUsers: body.user },
      });
    }

    await Order.create(body);

    const orders = await Order.find();

    return NextResponse.json(
      { message: "Order created successfully", orders },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
