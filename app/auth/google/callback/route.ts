import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getGoogleOAuthClient } from "@/app/utils/emailSending/oauth";
import User from "@/app/models/User";
import dbConnect from "@/app/utils/mongodb";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");

        if (!code) throw new Error("No code provided");

        await dbConnect();
        const oauth2Client = getGoogleOAuthClient();
        const { tokens } = await oauth2Client.getToken(code);

        const cookieStore = await cookies();
        const userId = cookieStore.get("builder_auth")?.value;

        if (!userId) throw new Error("Not logged in");

        // Validate that userId is a valid MongoDB ObjectId (24-character hex string)
        if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
            console.error("Invalid session ID detected:", userId);
            throw new Error("Invalid session. Please log in again.");
        }

        oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
        const { data } = await oauth2.userinfo.get();

        await User.findByIdAndUpdate(userId, {
            "emailConnection.provider": "gmail",
            "emailConnection.accessToken": tokens.access_token,
            "emailConnection.refreshToken": tokens.refresh_token,
            "emailConnection.expiryDate": tokens.expiry_date,
            "emailConnection.email": data.email,
        });


        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings?status=success`);
    } catch (error: any) {
        console.error("Google Callback Error:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings?status=error&message=${encodeURIComponent(error.message)}`);
    }
}
