import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Order from "@/models/Order";

export const PATCH = async (request: NextRequest) => {
  const { orderId, updatedStatus } = await request.json();

  // console.log("update order status", orderId, updatedStatus);
  
  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!validStatuses.includes(updatedStatus)) {
    return NextResponse.json(
      { error: "Invalid status value" },
      { status: 400 }
    );
  }

  try {
    await connectToMongoDB();

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: updatedStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order status updated successfully", updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
};
