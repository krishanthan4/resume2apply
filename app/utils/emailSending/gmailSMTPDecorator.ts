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
        scheduledAt?: string
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

            const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
            const messageParts = [
                `From: ${user.emailConnection.email}`,
                `To: ${to}`,
                `Content-Type: text/html; charset=utf-8`,
                `MIME-Version: 1.0`,
                `Subject: ${utf8Subject}`,
                "",
                body,
            ];

            // To add attachments in a simple raw way for Gmail API we need more multipart MIME formatting
            // Or we can use `nodemailer` just for formatting.
            // Let's use `nodemailer` for raw email creation if available.
            // But let's stick to core logic if possible.
            // I'll add `nodemailer` as it's common for building MIME mail.

            const raw = await this.createRawEmail(user.emailConnection.email!, to, subject, body, attachments);

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

    private async createRawEmail(from: string, to: string, subject: string, html: string, attachments?: any[]): Promise<string> {
        const boundary = "__REPLACE_THIS_WITH_RANDOM_BOUNDARY__";
        const header = [
            `From: ${from}`,
            `To: ${to}`,
            `Subject: ${subject}`,
            `MIME-Version: 1.0`,
            `Content-Type: multipart/mixed; boundary="${boundary}"`,
            "",
            `--${boundary}`,
            `Content-Type: text/html; charset="UTF-8"`,
            `Content-Transfer-Encoding: 7bit`,
            "",
            html,
            "",
        ];

        if (attachments) {
            for (const att of attachments) {
                header.push(`--${boundary}`);
                header.push(`Content-Type: application/pdf; name="${att.filename}"`);
                header.push(`Content-Disposition: attachment; filename="${att.filename}"`);
                header.push(`Content-Transfer-Encoding: base64`);
                header.push("");
                header.push(att.content); // assuming base64
                header.push("");
            }
        }

        header.push(`--${boundary}--`);

        return Buffer.from(header.join("\n"))
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }
}
