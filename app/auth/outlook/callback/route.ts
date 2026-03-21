import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import User from "@/app/models/User";
import * as msal from "@azure/msal-node";
import { cookies } from "next/headers";
import { Client } from "@microsoft/microsoft-graph-client";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        if (!code) throw new Error("No code provided");

        await dbConnect();
        const cookieStore = await cookies();
        const userId = cookieStore.get("builder_auth")?.value;

        if (!userId) throw new Error("Not logged in");

        // Validate that userId is a valid MongoDB ObjectId (24-character hex string)
        if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
            console.error("Invalid session ID detected:", userId);
            throw new Error("Invalid session. Please log in again.");
        }

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

        await User.findByIdAndUpdate(userId, {
            "emailConnection.provider": "outlook",
            "emailConnection.accessToken": tokenData.access_token,
            "emailConnection.refreshToken": tokenData.refresh_token,
            "emailConnection.expiryDate": Date.now() + (tokenData.expires_in * 1000),
            "emailConnection.email": userProfile.mail || userProfile.userPrincipalName,
        });

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings?status=success`);
    } catch (error: any) {
        console.error("Outlook Callback Error:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings?status=error&message=${encodeURIComponent(error.message)}`);
    }
}

