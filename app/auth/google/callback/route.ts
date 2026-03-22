import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getGoogleOAuthClient } from "@/app/utils/emailSending/oauth";
import User from "@/app/models/User";
import dbConnect from "@/app/utils/mongodb";
import { getSession, encrypt, COOKIE_NAME } from "@/app/lib/auth";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");

        if (!code) throw new Error("No code provided");

        await dbConnect();
        const oauth2Client = getGoogleOAuthClient();
        const { tokens } = await oauth2Client.getToken(code);

        const session = await getSession();
        const userId = session?.userId;

        oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
        const { data } = await oauth2.userinfo.get();
        if (!data.email) throw new Error("Could not retrieve email from Google");

        if (userId) {
            // SCENARIO 1: CONNECT EMAIL (User already logged in)
            await User.findByIdAndUpdate(userId, {
                "emailConnection.provider": "gmail",
                "emailConnection.accessToken": tokens.access_token,
                "emailConnection.refreshToken": tokens.refresh_token,
                "emailConnection.expiryDate": tokens.expiry_date,
                "emailConnection.email": data.email,
            });
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings?status=success`);
        } else {
            // SCENARIO 2: SOCIAL LOGIN / SIGNUP
            let user = await User.findOne({ email: data.email });

            if (!user) {
                // Register new user automatically
                user = await User.create({
                    name: data.name || data.email.split("@")[0],
                    email: data.email,
                    authType: "google",
                });

                // Seed default data for new user
                try {
                    const { seedUserDefaultData } = await import("@/app/utils/seedUserDefaults");
                    await seedUserDefaultData(user._id.toString());
                } catch (seedError) {
                    console.error("Error seeding default data for user:", seedError);
                }
            }

            // Sync email connection settings
            user.emailConnection = {
                provider: "gmail",
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiryDate: tokens.expiry_date || 0,
                email: data.email,
            };
            await user.save();

            // Establish session and redirect to dashboard
            const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`);

            // Create session payload
            const newSession = {
                userId: user._id.toString(),
                email: user.email,
                name: user.name,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            };

            const token = await encrypt(newSession);

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
        }
    } catch (error: any) {
        console.error("Google Callback Error:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login?status=error&message=${encodeURIComponent(error.message)}`);
    }
}


