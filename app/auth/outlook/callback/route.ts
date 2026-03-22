import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import User from "@/app/models/User";
import { Client } from "@microsoft/microsoft-graph-client";
import { getSession, encrypt, COOKIE_NAME } from "@/app/lib/auth";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        if (!code) throw new Error("No code provided");

        await dbConnect();

        const session = await getSession();
        const userId = session?.userId;

        const response = await fetch(`https://login.microsoftonline.com/${process.env.OUTLOOK_TENANT_ID || "common"}/oauth2/v2.0/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.OUTLOOK_CLIENT_ID!,
                client_secret: process.env.OUTLOOK_CLIENT_SECRET!,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/outlook/callback`,
            }),
        });

        const tokenData = await response.json();
        if (!tokenData.access_token) {
            console.error("Outlook Token Exchange Failed:", tokenData);
            throw new Error(tokenData.error_description || "Token exchange failed");
        }

        // Get email from Microsoft Graph using the new access token
        const client = Client.init({
            authProvider: (done) => {
                done(null, tokenData.access_token);
            },
        });

        const userProfile = await client.api("/me").get();
        const userEmail = userProfile.mail || userProfile.userPrincipalName;

        if (userId) {
            // SCENARIO 1: CONNECT EMAIL (Already logged in)
            await User.findByIdAndUpdate(userId, {
                "emailConnection.provider": "outlook",
                "emailConnection.accessToken": tokenData.access_token,
                "emailConnection.refreshToken": tokenData.refresh_token,
                "emailConnection.expiryDate": Date.now() + (tokenData.expires_in * 1000),
                "emailConnection.email": userEmail,
            });
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings?status=success`);
        } else {
            // SCENARIO 2: SOCIAL LOGIN / SIGNUP
            let user = await User.findOne({ email: userEmail });

            if (!user) {
                // Register new user
                user = await User.create({
                    name: userProfile.displayName || userEmail.split("@")[0],
                    email: userEmail,
                    authType: "outlook",
                });

                // Seed default data for new user
                try {
                    const { seedUserDefaultData } = await import("@/app/utils/seedUserDefaults");
                    await seedUserDefaultData(user._id.toString());
                } catch (seedError) {
                    console.error("Error seeding default data for user:", seedError);
                }
            }

            // Sync connection
            user.emailConnection = {
                provider: "outlook",
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                expiryDate: Date.now() + (tokenData.expires_in * 1000),
                email: userEmail,
            };
            await user.save();

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
        console.error("Outlook Callback Error:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login?status=error&message=${encodeURIComponent(error.message)}`);
    }
}



