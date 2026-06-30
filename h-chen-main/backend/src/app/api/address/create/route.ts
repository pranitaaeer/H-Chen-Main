import { connectToMongoDB } from "@/lib/db";
import Address from "@/models/Address";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    await connectToMongoDB();

    const body = await req.json();
    const { userId, address } = body;

    if (!userId || !address) {
      return NextResponse.json(
        { error: "Missing user ID or address information" },
        { status: 400 }
      );
    }

    const newAddress = new Address({
      user: userId,
      ...address,
    });

    await newAddress.save();

    return NextResponse.json({ success: true, data: newAddress }, { status: 201 });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}