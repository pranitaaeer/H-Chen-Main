import { connectToMongoDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    await connectToMongoDB();
    const { email, password, first_name, last_name } = await request.json();

    const isUserExist = await User.findOne({ email });

    if (isUserExist)
      return new NextResponse("User with this email already exist", {
        status: 401,
      });

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashPassword,
      first_name,
      last_name,
    });
    await user.save();

    return new NextResponse("User registered successfull!", { status: 200 });
  } catch (error) {
    // console.log(error);
    return new NextResponse("Internal server error.", { status: 500 });
  }
};
