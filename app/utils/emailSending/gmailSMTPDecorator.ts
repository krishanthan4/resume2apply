import { google } from "googleapis";
import { IEmailService } from "./decorator";
import User from "@/app/models/User";

export class GmailOAuthService implements IEmailService {
    private userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    public async sendEmail(
        to: string,
        subject: string,
        body: string,
        attachments?: any[],
        scheduledAt?: string,
        bcc?: string
    ): Promise<any> {

        try {
            const user = await User.findById(this.userId);
            if (!user || user.emailConnection?.provider !== "gmail") {
                throw new Error("User has not connected Gmail");
            }

            const oAuth2Client = new google.auth.OAuth2(
                process.env.GMAIL_CLIENT_ID,
                process.env.GMAIL_CLIENT_SECRET
            );

            oAuth2Client.setCredentials({
                refresh_token: user.emailConnection.refreshToken,
            });

            const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

            const raw = await this.createRawEmail(user.emailConnection.email!, to, subject, body, attachments, bcc);


            const res = await gmail.users.messages.send({
                userId: "me",
                requestBody: {
                    raw: raw,
                },
            });

            return { success: true, data: res.data };
        } catch (error: any) {
            console.error("Gmail Send Error:", error);
            return { success: false, error: error.message };
        }
    }

    private async createRawEmail(from: string, to: string, subject: string, html: string, attachments?: any[], bcc?: string): Promise<string> {
        const boundary = `----=_Part_${Math.random().toString(36).substring(2)}`;

        const headerLines = [
            `From: ${from}`,
            `To: ${to}`,
        ];

        if (bcc) {
            headerLines.push(`Bcc: ${bcc}`);
        }

        const encodedSubject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
        headerLines.push(`Subject: ${encodedSubject}`);
        headerLines.push(`MIME-Version: 1.0`);
        headerLines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
        headerLines.push(""); // End of main headers

        // Body Part
        headerLines.push(`--${boundary}`);
        headerLines.push(`Content-Type: text/html; charset="UTF-8"`);
        headerLines.push(`Content-Transfer-Encoding: 7bit`);
        headerLines.push("");
        headerLines.push(html);
        headerLines.push("");

        if (attachments) {
            for (const att of attachments) {
                headerLines.push(`--${boundary}`);
                headerLines.push(`Content-Type: application/pdf; name="${att.filename}"`);
                headerLines.push(`Content-Disposition: attachment; filename="${att.filename}"`);
                headerLines.push(`Content-Transfer-Encoding: base64`);
                headerLines.push("");
                headerLines.push(att.content); // assuming base64
                headerLines.push("");
            }
        }

        headerLines.push(`--${boundary}--`);

        return Buffer.from(headerLines.join("\r\n"))
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }
}


