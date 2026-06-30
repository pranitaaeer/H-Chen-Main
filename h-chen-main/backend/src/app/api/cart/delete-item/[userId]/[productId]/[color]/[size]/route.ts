import { connectToMongoDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { userId: string; productId: string, color: string, size: string } }
) => {
  const { userId, productId, color, size } = params;
  // console.log("params", params);

  try {
    await connectToMongoDB();

    // Validate all required parameters
    if (!userId || !productId || !color || !size) {
      return NextResponse.json(
        { error: "Missing user ID, product ID, color, or size information." },
        { status: 400 }
      );
    }

    // Find the user's cart
    let cart = await Cart.findOne({ user: new Types.ObjectId(userId) });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found." }, { status: 404 });
    }

    // Filter out the product to be deleted based on productId, color, AND size.
    // This ensures that only the exact variant of the product is removed.
    cart.products = cart.products.filter(
      (p: any) =>
        !(p.product.toString() === productId && p.color === color && p.size === size)
    );

    // Save the updated cart to the database
    await cart.save();

    // Re-run the aggregation pipeline to get the updated cart with populated product details
    // and include color and size. This matches the GET request's response structure.
    const updatedCart = await Cart.aggregate([
      {
        $match: {
          user: new Types.ObjectId(userId),
        },
      },
      {
        // Handle case where products array might become empty after deletion
        $unwind: {
          path: "$products",
          preserveNullAndEmptyArrays: true, // Keep the cart document even if products array is empty
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productData", // Use a distinct name for populated product data
        },
      },
      {
        $unwind: {
          path: "$productData",
          preserveNullAndEmptyArrays: true, // Preserve documents if productData is empty (e.g., product deleted from database)
        },
      },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          products: {
            $push: {
              // Only push if productData exists (i.e., not null from preserveNullAndEmptyArrays)
              $cond: [
                { $ifNull: ["$productData", false] },
                {
                  product: "$productData",
                  quantity: "$products.quantity",
                  color: "$products.color",
                  size: "$products.size",
                },
                "$$REMOVE", // Remove this element from the array if productData is null
              ],
            },
          },
        },
      },
      {
        // Final projection to ensure empty products array for empty carts,
        // and remove _id if not needed for the final response.
        $project: {
          _id: 0, // Exclude the cart _id if you don't need it in the final response
          user: "$user",
          products: {
            $cond: [
              { $eq: ["$products", [null]] }, // Check if the products array contains only null (from initial unwind)
              [], // If so, return an empty array
              "$products", // Otherwise, return the actual products array
            ],
          },
        },
      },
    ]);

    // Return the updated cart. If the cart becomes empty after deletion,
    // ensure an empty products array is returned.
    const finalUpdatedCart =
      updatedCart.length > 0
        ? updatedCart[0]
        : { user: new Types.ObjectId(userId), products: [] };

    return NextResponse.json(finalUpdatedCart, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product", details: String(error) },
      { status: 500 }
    );
  }
};
