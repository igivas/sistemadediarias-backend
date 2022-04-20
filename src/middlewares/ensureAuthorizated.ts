import { Request, Response, NextFunction } from 'express';
import { decode } from 'jsonwebtoken';
import AppError from '../errors/AppError';

interface ITokenPayload {
  iad: number;
  exp: number;
  sub: string;
}

export default function ensureAuthorization(roles: string[]): any {
  return function (request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError('JWT token is missing', 401);
    }

    const [, token] = authHeader.split(' ');

    const decoded = decode(token);

    const { sub } = decoded as ITokenPayload;
    const userInfo = JSON.parse(sub);
    const { perfis } = userInfo;

    const perfisText =
      perfis.length > 0
        ? perfis.map((perfil: { descricao: string }) => perfil.descricao)
        : [];

    if (!perfisText.includes(...roles)) {
      throw new AppError(
        'Usuário não possui autorização para esta requisição!',
        401,
      );
    }

    return next();
  };
}
