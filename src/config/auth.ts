export default {
  jwt: {
    secret: process.env.APP_SECRET || 'default',
    expiresIn: process.env.JWT_EXPIRESIN,
  },
};
