import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import User from "@/app/models/User";
import { cookies } from "next/headers";

export async function GET() {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const userId = cookieStore.get("builder_auth")?.value;

        if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
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
