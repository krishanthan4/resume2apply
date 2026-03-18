// app/utils/emailSending/EmailService.ts
import { IEmailService, EmailDecorator } from "./decorator";
import { ResendEmailService } from "./resendDecorator";

// Example of a concrete Decorator that logs dispatch times
export class LoggingEmailDecorator extends EmailDecorator {
    public async sendEmail(to: string, subject: string, body: string, attachments?: any[], scheduledAt?: string): Promise<any> {
        console.log(`[Email] Preparing to send to ${to} (Subject: ${subject}, Attachments: ${attachments?.length || 0})`);
        const result = await super.sendEmail(to, subject, body, attachments, scheduledAt);
        console.log(`[Email] Dispatch status for ${to} = ${result?.success ? 'SUCCESS' : 'FAILED'}`);
        return result;
    }
}

// Single factory pattern to init the system correctly anywhere in the app
export function getEmailService(): IEmailService {
    // In a full application, the fromEmail comes from DB or process.env
    const fromEmail = process.env.EMAIL_FROM || "applications@resume2apply.com";

    // We use the Resend service as the base class because it's configured
    const baseService = new ResendEmailService(fromEmail);

    // We wrap it in our logging decorator
    const loggingService = new LoggingEmailDecorator(baseService);

    return loggingService;
}
