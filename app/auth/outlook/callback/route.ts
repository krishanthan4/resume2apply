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

        const cca = new msal.ConfidentialClientApplication({
            auth: {
                clientId: process.env.OUTLOOK_CLIENT_ID!,
                authority: `https://login.microsoftonline.com/${process.env.OUTLOOK_TENANT_ID || "common"}`,
                clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
            },
        });

        const tokenResponse = await cca.acquireTokenByCode({
            code,
            scopes: ["https://graph.microsoft.com/Mail.Send", "https://graph.microsoft.com/User.Read", "offline_access"],
            redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/outlook/callback`,
        });

        if (!tokenResponse) throw new Error("Token exchange failed");

        // Get email from Microsoft Graph
        const client = Client.init({
            authProvider: (done) => {
                done(null, tokenResponse.accessToken);
            },
        });

        const userProfile = await client.api("/me").get();

        await User.findByIdAndUpdate(userId, {
            "emailConnection.provider": "outlook",
            "emailConnection.accessToken": tokenResponse.accessToken,
            "emailConnection.refreshToken": (tokenResponse as any).refreshToken,
            "emailConnection.expiryDate": tokenResponse.expiresOn?.getTime(),
            "emailConnection.email": userProfile.mail || userProfile.userPrincipalName,
        });

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings?status=success`);
    } catch (error: any) {
        console.error("Outlook Callback Error:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings?status=error&message=${encodeURIComponent(error.message)}`);
    }
}
