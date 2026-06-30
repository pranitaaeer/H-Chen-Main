import { connectToMongoDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    await connectToMongoDB();

    const body = await req.json();
    const { user, product, quantity } = body;

    if (!user || !product || !quantity) {
      return NextResponse.json(
        { error: "Missing user or product information" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found for user" },
        { status: 404 }
      );
    }

    const existingProductIndex = cart.products.findIndex(
      (p: any) => p.product._id == product
    );

    if (existingProductIndex !== -1) {
      if (cart.products[existingProductIndex].quantity + quantity <= 0) {
        cart.products.splice(existingProductIndex, 1);
      } else {
        cart.products[existingProductIndex].quantity += quantity;
      }
    } else {
      return NextResponse.json(
        { error: "Product not found in cart" },
        { status: 404 }
      );
    }

    await cart.save();
    // const populatedCart = await Cart.find({user})
    const updatedCart = await Cart.aggregate([
      {
        $match: { user: new Types.ObjectId(user) },
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "products.product",
        },
      },
      {
        $unwind: "$products.product",
      },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          products: {
            $push: {
              product: "$products.product",
              quantity: "$products.quantity",
            },
          },
        },
      },
    ]);

    return NextResponse.json(updatedCart[0], { status: 201 });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      {
        error: "Failed to add to cart",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
