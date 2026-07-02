// import { NextRequest, NextResponse } from "next/server";
// import { connectToMongoDB } from "@/lib/db";
// import Products from "@/models/Products";
// import { revalidatePath } from "next/cache";
// // import { utapi } from "@/utils/uploadthing";
// import { getUTApi } from "@/utils/uploadthing";

// const utapi = getUTApi();
// const errorResponse = (
//   message: string,
//   status: number = 500,
//   request: NextRequest
// ) => {
//   console.error(message);
//   revalidatePath(request.url);
//   return NextResponse.json({ success: false, error: message }, { status });
// };

// export const POST = async (request: NextRequest) => {
//   try {
//     const formData = await request.formData();

//     const title = formData.get("title")?.toString() || "";
//     const description = formData.get("description")?.toString() || "";
//     const category = formData.get("category")?.toString() || "";
//     const price = parseFloat(formData.get("price")?.toString() || "0");
//     const stock = parseFloat(formData.get("stock")?.toString() || "0");

//     const colors =
//       formData
//         .get("colors")
//         ?.toString()
//         .split(",")
//         .map((s) => s.trim())
//         .filter((s) => s !== "") || [];

//     const sizes =
//       formData
//         .get("sizes")
//         ?.toString()
//         .split(",")
//         .map((s) => s.trim())
//         .filter((s) => s !== "") || [];

//     // const imageFiles: File[] = [];
//     // for (const [key, value] of formData.entries()) {
//     //   if (key === "images" && value instanceof Blob) {
//     //     const filename =
//     //       (value as File).name ||
//     //       `uploaded_image_${Date.now()}.${value.type.split("/")[1] || "png"}`;
//     //     imageFiles.push(new File([value], filename, { type: value.type }));
//     //   }
//     // }

//     const imageFiles = formData.getAll("images") as File[];

//     if (!imageFiles.length) {
//       return errorResponse("No images provided", 400, request);
//     }
//     if (!title || !description || !category || isNaN(price) || price <= 0) {
//       return errorResponse(
//         "Missing or invalid required fields (title, description, category, brand, price, bestBefore, tags)",
//         400,
//         request
//       );
//     }

//     if (imageFiles.length === 0) {
//       return errorResponse(
//         "No images provided. Images are required.",
//         400,
//         request
//       );
//     }

//     await connectToMongoDB();
//     console.log("SECRET:", process.env.UPLOADTHING_SECRET);
//     console.log("APP_ID:", process.env.UPLOADTHING_APP_ID);
//     let uploadedImageUrls: string[] = [];
//     try {
//       // console.log("🖼️ Uploaded Image Files:", imageFiles);
//       const uploadResult = await utapi.uploadFiles(imageFiles);
//       // console.log("✅ Upload Result:", uploadResult);
//       uploadedImageUrls = uploadResult
//         .map((file) => file.data?.url)
//         .filter((url): url is string => !!url);

//       // console.log("uploadedImageUrls", uploadedImageUrls);

//       if (uploadedImageUrls.length === 0) {
//         return errorResponse(
//           "Failed to upload images to Uploadthing.",
//           500,
//           request
//         );
//       }
//     } catch (uploadError: any) {
//       console.error("Error during Uploadthing upload:", uploadError);
//       return errorResponse(
//         `Image upload failed: ${uploadError.message || "Unknown upload error."
//         }`,
//         500,
//         request
//       );
//     }
//     // console.log("product:", {
//     //   title,
//     //   description,
//     //   colors,
//     //   sizes,
//     //   images: uploadedImageUrls,
//     //   category,
//     //   price,
//     //   stock
//     // });


//     const newProduct = new Products({
//       title,
//       description,
//       colors,
//       sizes,
//       images: uploadedImageUrls,
//       category,
//       price,
//       stock
//     });

//     const savedProduct = await newProduct.save();
//     revalidatePath(request.url);

//     return NextResponse.json(
//       {
//         success: true,
//         message: `${savedProduct.title} product created successfully!`,
//         product: savedProduct,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Error creating product in API route:", error);

//     if (error.name === "ValidationError") {
//       return errorResponse(`Validation error: ${error.message}`, 400, request);
//     }

//     if (error.code === 11000) {
//       return errorResponse(
//         "A product with this SKU or slug already exists (duplicate key error).",
//         409,
//         request
//       );
//     }

//     if (
//       error.message === "Failed to generate unique SKU after multiple attempts."
//     ) {
//       return errorResponse(error.message, 500, request);
//     }

//     return errorResponse(
//       "An unexpected error occurred during product creation.",
//       500,
//       request
//     );
//   }
// };

import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";
import { revalidatePath } from "next/cache";
import { getUTApi } from "@/utils/uploadthing";

export const runtime = "nodejs";

const errorResponse = (
  message: string,
  status: number = 500,
  request: NextRequest
) => {
  console.error(message);
  return NextResponse.json({ success: false, error: message }, { status });
};

export const POST = async (request: NextRequest) => {
  try {
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
        .filter(Boolean) || [];

    const sizes =
      formData
        .get("sizes")
        ?.toString()
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean) || [];

    // ✅ FIX: Proper File extraction
    const imageFiles: File[] = [];

    for (const [key, value] of formData.entries()) {
      if (key === "images" && value instanceof File) {
        imageFiles.push(value);
      }
    }

    if (!title || !description || !category || !price) {
      return errorResponse("Missing required fields", 400, request);
    }

    if (imageFiles.length === 0) {
      return errorResponse("No images provided", 400, request);
    }

    await connectToMongoDB();

    let uploadedImageUrls: string[] = [];

    try {
      // ✅ FIX: UTApi inside try (safe for Vercel)
      const utapi = getUTApi();

      const uploadResult = await utapi.uploadFiles(imageFiles);

     uploadedImageUrls = uploadResult
  .map((file) => file.data?.url)
  .filter((url): url is string => typeof url === "string");
      if (!uploadedImageUrls.length) {
        return errorResponse("Image upload failed", 500, request);
      }
    } catch (err: any) {
      console.error("UploadThing Error:", err);
      return errorResponse(
        err.message || "Image upload failed",
        500,
        request
      );
    }

    const newProduct = new Products({
      title,
      description,
      category,
      price,
      stock,
      colors,
      sizes,
      images: uploadedImageUrls,
    });

    const savedProduct = await newProduct.save();

    revalidatePath(request.url);

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product: savedProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API Error:", error);

    return errorResponse(
      "Unexpected error occurred",
      500,
      request
    );
  }
};