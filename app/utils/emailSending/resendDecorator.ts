import { Resend } from 'resend';
import { IEmailService } from './decorator';

const resend = new Resend(process.env.RESEND_API_KEY!);

export class ResendEmailService implements IEmailService {
  private fromEmail: string;

  constructor(fromEmail: string) {
    this.fromEmail = fromEmail;
  }

  public async sendEmail(to: string, subject: string, body: string, attachments?: any[], scheduledAt?: string, bcc?: string): Promise<any> {
    try {
      const payload: any = {
        from: this.fromEmail,
        to: to,
        subject: subject,
        html: body,
      };
      if (attachments) payload.attachments = attachments;
      if (scheduledAt) payload.scheduled_at = scheduledAt;
      if (bcc) payload.bcc = bcc;


      const res = await resend.emails.send(payload);
      return { success: true, data: res.data, error: res.error };
    } catch (error: any) {
      console.error('Failed to send email via Resend:', error);
      return { success: false, error: error.message };
    }
  }
}
