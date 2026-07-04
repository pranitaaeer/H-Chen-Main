import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import RecommendedProducts from "@/models/RecommendedProducts";

export async function GET() {
    try {
        await connectToMongoDB();


        const recommendedProducts = await RecommendedProducts.find().sort({ index: 1 });
        return NextResponse.json(
            {
                success: true,
                recommendedProducts,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching recommended products:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch recommended products",
            },
            { status: 500 }
        );
    }
}