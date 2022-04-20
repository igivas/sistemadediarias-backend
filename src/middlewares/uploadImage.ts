import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import AppError from '../errors/AppError';
import multerConfig from '../config/multer';

const upload = multer(multerConfig.foto).single('file');

interface ITokenPayload {
  iad: number;
  exp: number;
  sub: string;
}

export default function uploadFile(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  try {
    upload(request, response, async (err: any) => {
      if (err) {
        return response.status(400).json({
          status: 'error',
          statusCode: 400,
          message:
            'Arquivo(s) inválido(s)! Somente formatos PNG, JPEG e JPG. Tamanho máximo de 1mB.',
        });
      }
      return next();
    });
  } catch (error) {
    throw new AppError('Ocorreu um erro no upload', 401);
  }
}
