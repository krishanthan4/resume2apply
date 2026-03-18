import { Resend } from 'resend';
import { IEmailService } from './decorator';

const resend = new Resend(process.env.RESEND_API_KEY!);

export class ResendEmailService implements IEmailService {
  private fromEmail: string;

  constructor(fromEmail: string) {
    this.fromEmail = fromEmail;
  }

  public async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    try {
      await resend.emails.send({
        from: this.fromEmail,
        to: to,
        subject: subject,
        html: body,
      });
      return true;
    } catch (error) {
      console.error('Failed to send email via Resend:', error);
      return false;
    }
  }
}
