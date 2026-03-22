import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    isPremium: boolean;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, isPremium: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.userId = user.id;
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, isPremium: true },
      });

      if (user) {
        req.userId = user.id;
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continuar sin autenticación si hay error
    next();
  }
};
