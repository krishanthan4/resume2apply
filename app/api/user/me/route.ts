import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import User from "@/app/models/User";
import { getSession } from "@/app/lib/auth";

export async function GET() {
    try {
        await dbConnect();
        const session = await getSession();
        const userId = session?.userId;

        if (!userId) {
            return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
        }

        const user = await User.findById(userId).select("-password -accessToken -refreshToken");
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

