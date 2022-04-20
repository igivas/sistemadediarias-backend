interface IMailConfig {
  driver: 'ethereal' | 'production';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'firebergtrue@gmail.com',
      name: 'Lindemberg Castro',
    },
  },
} as IMailConfig;
