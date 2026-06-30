import { connectToMongoDB } from "@/lib/db";
import Address from "@/models/Address";
import { NextRequest, NextResponse } from "next/server";



export async function PUT(req: NextRequest, { params }: { params: { addressId: string } }) {
  try {
    await connectToMongoDB();

    const body = await req.json();
    const { address } = body;

    if ( !address) {
      return NextResponse.json(
        { error: "Missing user ID or address information" },
        { status: 400 }
      );
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: params.addressId },
      address,
      { new: true }
    );

    if (!updatedAddress) {
      return NextResponse.json(
        { error: "Address not found or does not belong to the user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedAddress }, { status: 200 });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
    
}


export async function DELETE(req: NextRequest, { params }: { params: { addressId: string } }) {
  try {
    await connectToMongoDB();

    const deletedAddress = await Address.findOneAndDelete({ _id: params.addressId });

    if (!deletedAddress) {
      return NextResponse.json(
        { error: "Address not found or does not belong to the user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Address deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}