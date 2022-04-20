import { injectable, inject } from 'tsyringe';
import path from 'path';

import IMailProvider from '../providers/MailProvider/models/IMailProvider';

@injectable()
class SendEmailPinService {
  constructor(
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  async execute(pin: string, email: string): Promise<void> {
    const pinTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'email_pin_asisnatura.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: '',
        email,
      },
      subject: '[SGA - PMCE] Envio do PIN temporário',
      templateData: {
        file: pinTemplate,
        variables: {
          pin,
        },
      },
    });
  }
}

export default SendEmailPinService;
