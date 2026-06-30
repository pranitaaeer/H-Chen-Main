import { connectToMongoDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, { params }: { params: { user: string } }) => {
  try {
    await connectToMongoDB();

    const {user} = params

    if (!user) {
      return NextResponse.json(
        { error: "Missing user or product information" },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ user });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found for cart" },
        { status: 404 }
      );
    }

    cart.products = []
    await cart.save();
    return NextResponse.json({ message: "Cart clear successfully", cart }, { status: 200 });



  } catch (error) {
    console.error("Error clear cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
};
