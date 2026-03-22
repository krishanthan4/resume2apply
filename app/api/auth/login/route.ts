import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/utils/mongodb";
import User from "@/app/models/User";
import { encrypt, COOKIE_NAME } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Fetch user from MongoDB
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare hashed password
    const savedHash = (user.password || "").trim();
    const isMatch = await bcrypt.compare(password, savedHash).catch(() => false);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session payload
    const session = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    // Encrypt JWT
    const token = await encrypt(session);

    const response = NextResponse.json(
      { success: true, user: { id: user._id, email: user.email, name: user.name } },
      { status: 200 }
    );

    // Set auth cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

