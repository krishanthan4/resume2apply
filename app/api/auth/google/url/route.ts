import { NextResponse } from "next/server";
import { getGoogleOAuthClient } from "@/app/utils/emailSending/oauth";

export async function GET() {
    const oauth2Client = getGoogleOAuthClient();
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/gmail.send", "https://www.googleapis.com/auth/userinfo.email"],
        prompt: "consent",
    });

    return NextResponse.json({ url });
}
