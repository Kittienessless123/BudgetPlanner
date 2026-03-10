import type {  Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service.ts';

const logger = new LoggerService('HTTP');

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const responseTime = Date.now() - start;
    logger.logRequest(req, res, responseTime);
  });

  next();
};

export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  const errorLogger = new LoggerService('ERROR');
  
  errorLogger.error(`${err.message}`, {
    url: req.url,
    method: req.method,
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
    userId: (req as any).user?.id,
  });

  next(err);
};