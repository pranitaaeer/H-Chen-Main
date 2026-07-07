import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import razorpay from "@/lib/razorpay";
import Order from "@/models/Order";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB();

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required",
        },
        { status: 400 }
      );
    }

    // Find order from DB
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    // Prevent duplicate payment
    if (order.paymentStatus === "paid") {
      return NextResponse.json(
        {
          success: false,
          message: "Order already paid",
        },
        { status: 400 }
      );
    }

    // Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalPrice * 100), // Razorpay uses paise
      currency: "INR",
      receipt: order._id.toString(),
    });

    // Save Razorpay Order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return NextResponse.json(
      {
        success: true,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
        razorpayOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create Razorpay order",
      },
      { status: 500 }
    );
  }
}