import type { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../modules/token/service/token.service.ts';
import { Container } from '../../../database/di/container.ts';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1]; // Bearer <token>
    const tokenService = Container.get<TokenService>('TokenService');
    const userData = tokenService.validateAccessToken(token);
    if (!userData) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    (req as any).user = userData; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};