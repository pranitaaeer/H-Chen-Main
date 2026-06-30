import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";

export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    try {
      await connectToMongoDB();
  
      const product = await Products.findByIdAndDelete(id);
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
  
      revalidatePath(request.url);
      return NextResponse.json(
        { message: "Product deleted successfully!" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json(
        { error: "Failed to delete product" },
        { status: 500 }
      );
    }
  };