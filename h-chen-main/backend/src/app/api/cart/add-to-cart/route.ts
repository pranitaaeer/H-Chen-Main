import { connectToMongoDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToMongoDB();

    const body = await req.json();
    const { user, product } = body;

    if (!user || !product?.id) {
      return NextResponse.json(
        { error: "Missing user or product information" },
        { status: 400 }
      );
    }

    // Ensure valid ObjectId
    const userId = new Types.ObjectId(user);
    const productId = new Types.ObjectId(product.id);

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    // Find existing product in cart
    const existingProductIndex = cart.products.findIndex(
      (p: any) => p.product.toString() === productId.toString() && p.color === product.color && p.size === product.size
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += product.quantity || 1;
    } else {
      cart.products.push({
        product: productId,
        quantity: product.quantity || 1,
        color: product.color || null,
        size: product.size || null
      });
    }

    await cart.save();

    // Fetch updated cart with product details
    const userCart = await Cart.aggregate([
      {
        $match: {
          user: userId,
          products: { $exists: true, $ne: [] }
        },
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: {
          path: "$productData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          products: {
            $push: {
              product: "$productData",
              quantity: "$products.quantity",
              color: "$products.color",
              size: "$products.size"
            },
          },
        },
      },
    ]);

    // Always return a cart object
    return NextResponse.json(userCart[0] || { user: userId, products: [] }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to add to cart",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
