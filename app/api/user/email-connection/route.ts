import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import User from "@/app/models/User";
import { cookies } from "next/headers";

export async function DELETE() {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const userId = cookieStore.get("builder_auth")?.value;

        if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
            return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
        }

        await User.findByIdAndUpdate(userId, {
            $set: {
                "emailConnection.provider": "none",
                "emailConnection.accessToken": "",
                "emailConnection.refreshToken": "",
                "emailConnection.expiryDate": 0,
                "emailConnection.email": "",
            }
        });

        return NextResponse.json({ success: true, message: "Email connection removed" });
    } catch (error: any) {
        console.error("Disconnect Email Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
