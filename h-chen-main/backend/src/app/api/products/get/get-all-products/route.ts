// import { NextResponse } from "next/server";
// import { connectToMongoDB } from "@/lib/db";
// import Products from "@/models/Products";

// export async function GET() {
//   try {
//     await connectToMongoDB();

//     const products = await Products.find().sort({ createdAt: -1 });

//     return NextResponse.json({
//       success: true,
//       data: products,
//     });
//   } catch (error) {
//     console.error("Error fetching all products:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch products",
//       },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";

export async function GET() {
  try {
    await connectToMongoDB();

    const products = await Products.find().sort({ createdAt: -1 });

    const transformedProducts = products.map((product) => ({
      _id: product._id,
      sku: "",
      title: product.title,
      brand: "",
      description: product.description,

      category: {
        title: product.category,
        slug: product.category,
      },

      variants: [
        {
          images: product.images,
          stock: product.stock,
          form: "",
          netQuantity: "",
          nutritionFacts: [],
          allergens: [],
          servingSize: "",
        },
      ],

      images: product.images,

      price: product.price,
      salePrice: product.price,
      discount: 0,

      ratings: 0,
      reviews_number: 0,

      sell_on_google_quantity: product.stock,
      isSingleVariantProduct: true,

      heroBanner: null,
      dailyRitual: null,
      ingredientHighlights: [],

      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    return NextResponse.json(transformedProducts);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}