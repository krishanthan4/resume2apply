import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/utils/mongodb";
import User from "@/app/models/User";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Fetch user from MongoDB (using email as username)
    const user = await User.findOne({ email: username });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Since the user might have saved the plain text to the hash field initially, we check
    // Ensure we trim any accidental whitespace copied from the generator
    const savedHash = (user.password || "").trim();

    // In production, ALWAYS save the hashed password. This accommodates the first-time setup or hashed versions.
    const isMatch = await bcrypt.compare(password, savedHash).catch(() => false);

    // Fallback just in case user saved plaintext manually in Sanity studio for testing
    const isPlainTextMatch = password === savedHash;

    if (!isMatch && !isPlainTextMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Set auth cookie
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Cookie expires in 7 days
    response.cookies.set({
      name: "builder_auth",
      value: user._id.toString(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
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
