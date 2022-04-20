import { container } from 'tsyringe';
import mailConfig from '../config/mail';

import IMailProvider from '../modules/sga/providers/MailProvider/models/IMailProvider';
import EtherealMailProvider from '../modules/sga/providers/MailProvider/implementations/EtherealMailProvider';
import ProductionMailProvider from '../modules/sga/providers/MailProvider/implementations/ProductionMailProvider';

import IMailTemplateProvider from '../modules/sga/providers/MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from '../modules/sga/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  mailConfig.driver === 'ethereal'
    ? container.resolve(EtherealMailProvider)
    : container.resolve(ProductionMailProvider),
);
