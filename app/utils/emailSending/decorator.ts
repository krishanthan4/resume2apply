// app/utils/emailSending/decorator.ts
export interface IEmailService {
  sendEmail(to: string, subject: string, body: string, attachments?: any[], scheduledAt?: string): Promise<any>;
}

export class EmailDecorator implements IEmailService {
  protected wrappedService: IEmailService;

  constructor(service: IEmailService) {
    this.wrappedService = service;
  }

  public async sendEmail(to: string, subject: string, body: string, attachments?: any[], scheduledAt?: string): Promise<any> {
    return this.wrappedService.sendEmail(to, subject, body, attachments, scheduledAt);
  }
}
