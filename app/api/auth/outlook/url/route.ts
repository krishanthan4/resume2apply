import { NextResponse } from "next/server";
import * as msal from "@azure/msal-node";

export async function GET() {
    const pca = new msal.PublicClientApplication({
        auth: {
            clientId: process.env.OUTLOOK_CLIENT_ID!,
            authority: `https://login.microsoftonline.com/${process.env.OUTLOOK_TENANT_ID || "common"}`,
        },
    });

    const authCodeUrlParameters = {
        scopes: [
            "https://graph.microsoft.com/Mail.Send",
            "https://graph.microsoft.com/User.Read",
            "offline_access",
            "openid",
            "profile"
        ],
        redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/outlook/callback`,
        prompt: "select_account",
    };


    const url = await pca.getAuthCodeUrl(authCodeUrlParameters);

    return NextResponse.json({ url });
}
