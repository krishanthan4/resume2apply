import { Client } from "@microsoft/microsoft-graph-client";
import { IEmailService } from "./decorator";
import User from "@/app/models/User";
import { refreshOutlookToken } from "./oauth";

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
        scheduledAt?: string,
        bcc?: string
    ): Promise<any> {
        try {
            const user = await User.findById(this.userId);
            if (!user || user.emailConnection?.provider !== "outlook") {
                throw new Error("User has not connected Outlook");
            }

            const token = await this.getAccessToken();
            if (!token) throw new Error("Failed to retrieve Outlook access token");


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
                    bccRecipients: bcc ? [
                        {
                            emailAddress: {
                                address: bcc,
                            },
                        },
                    ] : [],
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

    private async getAccessToken(): Promise<string | null> {
        return await refreshOutlookToken(this.userId);
    }
}

