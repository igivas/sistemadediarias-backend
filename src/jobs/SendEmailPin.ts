import { container } from 'tsyringe';
import SendEmailPinService from '../modules/sga/services/SendEmailPinService';

export default {
  key: 'SendEmailPin',
  options: {
    priority: 1,
    attempts: 5,
  },
  async handle({ data }: any): Promise<void> {
    const { pin, email } = data;
    const sendEmailPinService = container.resolve(SendEmailPinService);

    await sendEmailPinService.execute(pin, email);
  },
};
