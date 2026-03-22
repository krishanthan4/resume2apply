import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import User from "@/app/models/User";
import { getSession } from "@/app/lib/auth";

export async function DELETE() {
    try {
        await dbConnect();
        const session = await getSession();
        const userId = session?.userId;

        if (!userId) {
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

