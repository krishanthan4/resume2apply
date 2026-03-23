import { IEmailService, EmailDecorator } from "./decorator";
import { ResendEmailService } from "./resendDecorator";
import { GmailOAuthService } from "./gmailSMTPDecorator";
import { OutlookOAuthService } from "./outlookSMTPDecorator";
import User from "@/app/models/User";

// Example of a concrete Decorator that logs dispatch times
export class LoggingEmailDecorator extends EmailDecorator {
    public async sendEmail(to: string, subject: string, body: string, attachments?: any[], scheduledAt?: string, bcc?: string): Promise<any> {
        console.log(`[Email] Preparing to send to ${to} (Subject: ${subject}, Attachments: ${attachments?.length || 0}, BCC: ${bcc || 'none'})`);
        const result = await super.sendEmail(to, subject, body, attachments, scheduledAt, bcc);
        console.log(`[Email] Dispatch status for ${to} = ${result?.success ? 'SUCCESS' : 'FAILED'}`);
        return result;
    }
}


// BCC decorator to handle verification copies
export class BCCEmailDecorator extends EmailDecorator {
    private userId?: string;

    constructor(service: IEmailService, userId?: string) {
        super(service);
        this.userId = userId;
    }

    public async sendEmail(to: string, subject: string, body: string, attachments?: any[], scheduledAt?: string, bcc?: string): Promise<any> {
        let finalBcc = bcc;

        if (this.userId && !finalBcc) {
            const user = await User.findById(this.userId);
            if (user?.bccSettings?.enabled) {
                finalBcc = user.bccSettings.customEmail || user.email;
            }
        }

        return await super.sendEmail(to, subject, body, attachments, scheduledAt, finalBcc);
    }
}

// Rate limiting decorator to avoid spam-triggering patterns
export class RateLimitingEmailDecorator extends EmailDecorator {
    private userId?: string;
    private DAILY_LIMIT = 50; // Example limit

    constructor(service: IEmailService, userId?: string) {
        super(service);
        this.userId = userId;
    }

    public async sendEmail(to: string, subject: string, body: string, attachments?: any[], scheduledAt?: string, bcc?: string): Promise<any> {
        if (this.userId) {
            const Job = require("@/app/models/Job").default;
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const sentToday = await Job.countDocuments({
                userId: this.userId,
                status: "applied",
                updatedAt: { $gte: startOfDay }
            });

            if (sentToday >= this.DAILY_LIMIT) {
                return { success: false, error: `Daily limit of ${this.DAILY_LIMIT} emails reached. Please try again tomorrow.` };
            }
        }

        return await super.sendEmail(to, subject, body, attachments, scheduledAt, bcc);
    }
}


// Single factory pattern to init the system correctly anywhere in the app
export async function getEmailServiceForUser(userId?: string): Promise<IEmailService> {
    const fromEmail = process.env.EMAIL_FROM || "applications@resume2apply.com";

    let baseService: IEmailService = new ResendEmailService(fromEmail);

    if (userId) {
        const user = await User.findById(userId);
        if (user && user.emailConnection) {
            const provider = user.emailConnection.provider;
            if (provider === 'gmail') {
                baseService = new GmailOAuthService(userId);
            } else if (provider === 'outlook') {
                baseService = new OutlookOAuthService(userId);
            }
        }
    }

    // Wrap in logging decorator
    let service: IEmailService = new LoggingEmailDecorator(baseService);

    // Apply User-specific patterns
    if (userId) {
        // Wrap in BCC decorator (verification copies)
        service = new BCCEmailDecorator(service, userId);

        // Wrap in rate limiting decorator (spam prevention)
        service = new RateLimitingEmailDecorator(service, userId);
    }

    return service;
}

