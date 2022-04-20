import { injectable, inject } from 'tsyringe';
import path from 'path';
import IMailProvider from '../providers/MailProvider/models/IMailProvider';

interface IRequest {
  email: string;
}

@injectable()
class SendEmailCodigoValidacaoService {
  constructor(
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  async execute(email: string, codigo: number): Promise<void> {
    const codigoValidacaoTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'email_codigo_validacao.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: '',
        email,
      },
      subject: '[SGA - PMCE] Envio de código de validação de email',
      templateData: {
        file: codigoValidacaoTemplate,
        variables: {
          // name: 'lindemberg',
          codigo,
        },
      },
    });
  }
}

export default SendEmailCodigoValidacaoService;
