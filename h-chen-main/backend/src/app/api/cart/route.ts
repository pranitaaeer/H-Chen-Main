import { connectToMongoDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { Types } from "mongoose";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToMongoDB();
    const userId = req.nextUrl.searchParams.get("user");

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    // Aggregation pipeline to fetch cart, populate product details,
    // and include color and size for each item.
    const cart = await Cart.aggregate([
      {
        // Match the cart for the specific user and ensure it has products
        $match: {
          user: new Types.ObjectId(userId),
          products: { $exists: true, $ne: [] }, // Only return carts with products
        },
      },
      {
        // Deconstruct the 'products' array field from the input documents to output
        // a document for each element. This allows us to lookup each product individually.
        $unwind: "$products",
      },
      {
        // Perform a left outer join to the 'products' collection
        // to retrieve the full product details for each product ID in the cart.
        $lookup: {
          from: "products", // The collection name for your Product model
          localField: "products.product", // Field from the input documents (cart items)
          foreignField: "_id", // Field from the "products" collection
          as: "productData", // The array field to add to the input documents
        },
      },
      {
        // Deconstruct the 'productData' array. Since $lookup adds an array,
        // and we expect only one product per ID, $unwind simplifies it to an object.
        $unwind: "$productData",
      },
      {
        // Regroup documents by the original cart ID.
        // This reconstructs the cart, but now with populated product details.
        $group: {
          _id: "$_id", // Group by the cart's unique ID
          user: { $first: "$user" }, // Get the user ID (first one encountered for the group)
          products: {
            $push: {
              // Push the populated product details, quantity, color, and size
              product: "$productData",
              quantity: "$products.quantity",
              color: "$products.color", // Include the color from the cart item
              size: "$products.size",   // Include the size from the cart item
            },
          },
        },
      },
    ]);

    // Format the final response: if a cart is found, return the first one;
    // otherwise, return an empty cart object for the user.
    const finalCart =
      cart.length > 0
        ? cart[0]
        : { user: new Types.ObjectId(userId), products: [] };

    return NextResponse.json(finalCart, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart", details: String(error) },
      { status: 500 }
    );
  }
}
