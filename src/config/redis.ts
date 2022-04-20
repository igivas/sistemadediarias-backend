interface IRedisOpts {
  redis: {
    port?: number;
    host?: string;
    db?: number;
    password?: string;
  };
}

const redisConfig: IRedisOpts = {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
};

export default redisConfig;
