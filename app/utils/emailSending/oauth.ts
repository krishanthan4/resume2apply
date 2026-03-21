import { google } from "googleapis";
import * as msal from "@azure/msal-node";
import User from "@/app/models/User";

const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const OUTLOOK_CLIENT_ID = process.env.OUTLOOK_CLIENT_ID;
const OUTLOOK_CLIENT_SECRET = process.env.OUTLOOK_CLIENT_SECRET;
const OUTLOOK_TENANT_ID = process.env.OUTLOOK_TENANT_ID || "common";

export function getGoogleOAuthClient() {
    return new google.auth.OAuth2(
        GMAIL_CLIENT_ID,
        GMAIL_CLIENT_SECRET,
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/callback`
    );
}

export async function refreshGoogleToken(userId: string) {
    const user = await User.findById(userId);
    if (!user || user.emailConnection?.provider !== "gmail") return null;

    const oauth2Client = getGoogleOAuthClient();
    oauth2Client.setCredentials({
        refresh_token: user.emailConnection.refreshToken,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();
    user.emailConnection.accessToken = credentials.access_token!;
    user.emailConnection.expiryDate = credentials.expiry_date!;
    await user.save();

    return credentials.access_token!;
}

export async function refreshOutlookToken(userId: string) {
    const user = await User.findById(userId);
    if (!user || user.emailConnection?.provider !== "outlook") return null;

    const refreshToken = user.emailConnection.refreshToken;

    try {
        const response = await fetch(`https://login.microsoftonline.com/${OUTLOOK_TENANT_ID}/oauth2/v2.0/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: OUTLOOK_CLIENT_ID!,
                client_secret: OUTLOOK_CLIENT_SECRET!,
                grant_type: "refresh_token",
                refresh_token: refreshToken!,
                scope: "https://graph.microsoft.com/Mail.Send offline_access",
            }),
        });

        const data = await response.json();

        if (data.access_token) {
            user.emailConnection.accessToken = data.access_token;

            // Update the refresh token if a new one is provided (rotation)
            if (data.refresh_token) {
                user.emailConnection.refreshToken = data.refresh_token;
            }

            // Save the new expiry date
            if (data.expires_in) {
                user.emailConnection.expiryDate = Date.now() + (data.expires_in * 1000);
            }

            await user.save();
            return data.access_token;
        }
    } catch (error) {
        console.error("Error refreshing Outlook token:", error);
    }

    return null;
}

