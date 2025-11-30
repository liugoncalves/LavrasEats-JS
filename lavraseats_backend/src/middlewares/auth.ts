import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  email: string;
  cargo: string;
  iat: number;
  exp: number;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ erro: 'Faça login para continuar' });
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const { id, email, cargo } = decoded as TokenPayload;

    req.user = { id, email, cargo };

    return next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}