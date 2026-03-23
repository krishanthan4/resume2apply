import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/utils/mongodb";
import User from "@/app/models/User";
import { encrypt, COOKIE_NAME } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Seed default data for new user
    try {
      const { seedUserDefaultData } = await import("@/app/utils/seedUserDefaults");
      await seedUserDefaultData(newUser._id.toString());
    } catch (seedError) {
      console.error("Error seeding default data for user:", seedError);
      // We don't block registration if seeding fails, but we log it
    }


    // Create session payload
    const session = {
      userId: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    // Encrypt JWT
    const token = await encrypt(session);

    // Set auth cookie
    const response = NextResponse.json(
      { success: true, message: "User created successfully" },
      { status: 201 }
    );

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
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

