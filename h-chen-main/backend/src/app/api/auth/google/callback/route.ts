import { NextRequest, NextResponse } from "next/server";
import { signJwt } from "@/lib/jwt";
import User from "@/models/User";
import { connectToMongoDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "No code" }, { status: 400 });

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL!}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });
  const tokenData = await tokenRes.json();

  // Get user info
  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const user = await userRes.json();

  // save user to db
  // console.log("User: ", user);

  connectToMongoDB()
  const existingUser = await User.findOne({ googleId: user.id })

  let userToSave;
  if(!existingUser){
    userToSave = new User({
      name: user.name,
      email: user.email,
      googleId: user.id,
      picture: user.picture,
    })

    await userToSave.save()
  } else {
    userToSave = existingUser;
  }
  

  // Create our own JWT for frontend
  const jwtToken = signJwt({
    id: userToSave._id,
    googleId: userToSave.googleId,
    name: userToSave.name,
    email: userToSave.email,
    picture: userToSave.picture,
  });

  // Redirect to Vite frontend with JWT
  return NextResponse.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${jwtToken}`);
}
