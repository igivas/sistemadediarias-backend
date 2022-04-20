import { injectable, inject } from 'tsyringe';
import path from 'path';
import IMailProvider from '../providers/MailProvider/models/IMailProvider';

@injectable()
class SendEmailLinkAssinaturaService {
  constructor(
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  get key(): string {
    return 'EmailLinkAssinatura';
  }

  async execute(email: string, token: string): Promise<void> {
    const linkAssinaturaTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'email_link_assinatura.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: '',
        email,
      },
      subject: '[SGA - PMCE] Envio do link de criação de assinatura',
      templateData: {
        file: linkAssinaturaTemplate,
        variables: {
          link: `${process.env.URL_CLIENT}/assinaturas/${token}`,
        },
      },
    });
  }
}

export default SendEmailLinkAssinaturaService;
