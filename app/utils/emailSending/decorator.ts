// app/utils/emailSending/decorator.ts
export interface IEmailService {
  sendEmail(to: string, subject: string, body: string): Promise<boolean>;
}

export class EmailDecorator implements IEmailService {
  protected wrappedService: IEmailService;

  constructor(service: IEmailService) {
    this.wrappedService = service;
  }

  public async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    return this.wrappedService.sendEmail(to, subject, body);
  }
}
