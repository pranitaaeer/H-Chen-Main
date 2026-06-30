import { connectToMongoDB } from "@/lib/db";
import Address from "@/models/Address";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { userId: string, addressId: string } }) {
  try {
    const {userId, addressId} = params;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    await connectToMongoDB();
    const addresses = await Address.findById(addressId).where('user').equals(userId);
    return NextResponse.json(addresses, { status: 200 });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

