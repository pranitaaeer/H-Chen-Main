import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        await connectToMongoDB();

        const products = await request.json();

        if (!Array.isArray(products) || products.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No products found",
                },
                { status: 400 }
            );
        }

        const formattedProducts = products.map((item) => ({
            title: item.title,
            description: item.description,
            category: item.category,
            price: Number(item.price?.toString().replace(/,/g, "")) || 0,
            stock: Number(item.stock) || 0,
            colors: item.colors || [],
            sizes: item.sizes || [],
            images: item.images || [],
        }));

        const inserted = await Products.insertMany(formattedProducts);

        return NextResponse.json(
            {
                success: true,
                message: `${inserted.length} Products Created`,
                data: inserted,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error(err);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create products",
            },
            { status: 500 }
        );
    }
}