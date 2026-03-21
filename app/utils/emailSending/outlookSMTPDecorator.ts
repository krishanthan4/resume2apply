import { Client } from "@microsoft/microsoft-graph-client";
import { IEmailService } from "./decorator";
import User from "@/app/models/User";
import * as msal from "@azure/msal-node";

export class OutlookOAuthService implements IEmailService {
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
            if (!user || user.emailConnection?.provider !== "outlook") {
                throw new Error("User has not connected Outlook");
            }

            const token = await this.getAccessToken(user);

            const client = Client.init({
                authProvider: (done) => {
                    done(null, token);
                },
            });

            const sendMailPayload: any = {
                message: {
                    subject: subject,
                    body: {
                        contentType: "HTML",
                        content: body,
                    },
                    toRecipients: [
                        {
                            emailAddress: {
                                address: to,
                            },
                        },
                    ],
                    attachments: attachments?.map(att => ({
                        "@odata.type": "#microsoft.graph.fileAttachment",
                        name: att.filename,
                        contentType: "application/pdf",
                        contentBytes: att.content,
                    })),
                },
                saveToSentItems: "true",
            };

            const res = await client.api("/me/sendMail").post(sendMailPayload);

            return { success: true, data: res };
        } catch (error: any) {
            console.error("Outlook Send Error:", error);
            return { success: false, error: error.message };
        }
    }

    private async getAccessToken(user: any): Promise<string> {
        const cca = new msal.ConfidentialClientApplication({
            auth: {
                clientId: process.env.OUTLOOK_CLIENT_ID!,
                authority: `https://login.microsoftonline.com/${process.env.OUTLOOK_TENANT_ID || "common"}`,
                clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
            },
        });

        const result = await cca.acquireTokenByRefreshToken({
            refreshToken: user.emailConnection.refreshToken!,
            scopes: ["https://graph.microsoft.com/Mail.Send"],
        });

        return result?.accessToken || "";
    }
}
