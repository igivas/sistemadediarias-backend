import handlebars from 'handlebars';
import fs from 'fs';

import IParseMailTemplateDTO from '../../../providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '../../../providers/MailTemplateProvider/models/IMailTemplateProvider';

export default class HandlebarsMailTemplateProvider
  implements IMailTemplateProvider {
  public async parse({
    file,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}
