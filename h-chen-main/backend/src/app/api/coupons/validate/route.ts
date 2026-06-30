import Coupnon from "@/models/Coupon";
import { NextRequest, NextResponse } from "next/server";

interface CouponData {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  quantity: number;
  perCustomer: number;
  usedUsers: [string];
}

export const POST = async (req: NextRequest) => {
  try {
    const { code, userId } = await req.json();

    // find coupen by code
    const coupon: CouponData | null = await Coupnon.findOne({ code });
    if (!coupon)
      return NextResponse.json(
        { success: false, error: "Coupon not found" },
        { status: 404 }
      );

    // Validate date
    const date = new Date();
    const startDate = new Date(coupon.startDate);
    const expirationDate = new Date(coupon.endDate);

    if (date < startDate || date > expirationDate) {
      return NextResponse.json(
        { success: false, error: "Coupon is not active" },
        { status: 400 }
      );
    }

    // validate stock
    if (coupon.quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "Coupon is out of stock" },
        { status: 400 }
      );
    }

    // validate user
    const allowPerCustomer = coupon.perCustomer;
    let userUsed = 0;
    coupon?.usedUsers?.map((id) => id == userId && userUsed++);

    if (allowPerCustomer && userUsed >= allowPerCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: "You already used this coupon for maximum time",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Coupon is valid",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json({
      error: "Failed to validate coupon",
      status: 500,
    });
  }
};
