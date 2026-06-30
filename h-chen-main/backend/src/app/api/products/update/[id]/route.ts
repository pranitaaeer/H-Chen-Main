import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";
import { revalidatePath } from "next/cache";
import { utapi } from "@/utils/uploadthing";

const errorResponse = (
  message: string,
  status: number = 500,
  request: NextRequest
) => {
  console.error(message);
  revalidatePath(request.url);
  return NextResponse.json({ success: false, error: message }, { status });
};

type Tproduct = {
  title: string;
  description: string;
  price: number;
  colors: string[];
  sizes: string[];
  category: string;
  images: string[];
  stock: number,
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const productId = params.id;
    if (!productId) return errorResponse("Product ID is missing", 400, request);

    const formData = await request.formData();

    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const price = parseFloat(formData.get("price")?.toString() || "0");
    const stock = parseFloat(formData.get("stock")?.toString() || "0");

    const colors =
      formData
        .get("colors")
        ?.toString()
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "") || [];

    const sizes =
      formData
        .get("sizes")
        ?.toString()
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "") || [];

    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === "images" && value instanceof Blob) {
        const filename =
          (value as File).name ||
          `uploaded_image_${Date.now()}.${value.type.split("/")[1] || "png"}`;
        imageFiles.push(new File([value], filename, { type: value.type }));
      }
    }

    await connectToMongoDB();

    const existingProduct = await Products.findById(productId);
    if (!existingProduct) {
      return errorResponse("Product not found", 404, request);
    }

    let uploadedImageUrls: string[] = existingProduct.images;

    if (imageFiles.length > 0) {
      // Optional: Delete previous images (if using UploadThing & want cleanup)
      try {
        if (existingProduct.images.length > 0) {
          const deleteRes = await utapi.deleteFiles(existingProduct.images);
          // console.log("🧹 Old images deleted:", deleteRes);
        }
      } catch (deleteError) {
        console.warn("⚠️ Failed to delete old images:", deleteError);
      }

      try {
        const uploadResult = await utapi.uploadFiles(imageFiles);
        uploadedImageUrls = uploadResult
          .map((file) => file.data?.url)
          .filter((url): url is string => !!url);

        if (uploadedImageUrls.length === 0) {
          return errorResponse("Failed to upload new images", 500, request);
        }
      } catch (uploadError: any) {
        return errorResponse(
          `Image upload failed: ${uploadError.message}`,
          500,
          request
        );
      }
    }

    const updatedFields: Tproduct = {
      title: title || existingProduct.title,
      description: description || existingProduct.description,
      category: category || existingProduct.category,
      colors: colors.length ? colors : existingProduct.colors,
      sizes: sizes.length ? sizes : existingProduct.sizes,
      price: price || existingProduct.price,
      stock: stock || existingProduct.stock,
      images: uploadedImageUrls,
    };

    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      updatedFields,
      { new: true } // ✅ return updated doc
    );

    revalidatePath(request.url);

    return NextResponse.json({
      success: true,
      message: `${updatedProduct?.title} updated successfully!`,
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error("❌ Error updating product:", error);
    return errorResponse(
      "Unexpected error during product update",
      500,
      request
    );
  }
};
