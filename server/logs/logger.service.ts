import winston from 'winston';
import fs from 'fs';
import { loggerConfig } from './logger.config.ts';

// Создаем папку для логов, если её нет
if (!fs.existsSync(loggerConfig.logDir)) {
  fs.mkdirSync(loggerConfig.logDir, { recursive: true });
}

// Создаем логгер
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat()
  ),
  transports: [
    loggerConfig.transports.console,
    loggerConfig.transports.errorFile,
    loggerConfig.transports.combinedFile,
    loggerConfig.transports.httpFile,
  ],
  exceptionHandlers: loggerConfig.exceptionHandlers,
  rejectionHandlers: loggerConfig.rejectionHandlers,
  exitOnError: false,
});

// Добавляем методы для удобства
export class LoggerService {
  private context?: string;

  constructor(context?: string | undefined) {
    this.context = context;
  }

  private formatMessage(message: string, meta?: any): string {
    const contextStr = this.context ? `[${this.context}] ` : '';
    return `${contextStr}${message}`;
  }

  info(message: string, meta?: any) {
    logger.info(this.formatMessage(message), meta);
  }

  error(message: string, meta?: any) {
    logger.error(this.formatMessage(message), meta);
  }

  warn(message: string, meta?: any) {
    logger.warn(this.formatMessage(message), meta);
  }

  debug(message: string, meta?: any) {
    logger.debug(this.formatMessage(message), meta);
  }

  http(message: string, meta?: any) {
    logger.http(this.formatMessage(message), meta);
  }

  // Для логирования запросов
  logRequest(req: any, res: any, responseTime?: number) {
    const message = `${req.method} ${req.url} ${res.statusCode} ${responseTime}ms`;
    const meta = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?.id,
    };
    
    if (res.statusCode >= 400) {
      this.error(message, meta);
    } else {
      this.http(message, meta);
    }
  }
}

// Экспортируем инстанс для простого импорта
export default new LoggerService();