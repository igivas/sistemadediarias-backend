import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import { createConnection } from 'typeorm';
// import MyCustomLogger from '@config/logger';
import AppError from './errors/AppError';
// import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

// import './database';
import './container';

const initServer = async (): Promise<void> => {
  await createConnection();
  const app = express();
  app.use(cors());
  // app.use(rateLimiter);
  app.use(express.json());
  app.use('/files', express.static(uploadConfig.uploadsFolder));
  app.use('/assets', express.static(uploadConfig.assetsFolder));
  app.use(routes);

  app.use(
    (error: Error, request: Request, response: Response, _: NextFunction) => {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          status: 'error',
          statusCode: error.statusCode,
          message: error.message,
        });
      }
      console.error(error);

      return response.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Internal server error',
      });
    },
  );

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server started on port ${process.env.PORT}`);
  });
};

initServer();
