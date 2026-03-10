import * as winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, json } = winston.format;

const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ level, message, timestamp, ...meta }) => {
    const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} [${level}]: ${message}${metaString}`;
  })
);

const fileFormat = combine(
  timestamp(),
  json()
);

const logDir = path.join(process.cwd(), 'logs');

export const loggerConfig = {
  logDir,
  
  transports: {
    console: new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: consoleFormat,
    }),

    errorFile: new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, 
      maxFiles: 5,
    }),

    combinedFile: new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: fileFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),

    httpFile: new winston.transports.File({
      filename: path.join(logDir, 'http.log'),
      level: 'http',
      format: fileFormat,
      maxsize: 5242880,
      maxFiles: 3,
    }),
  },

  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logDir, 'exceptions.log'),
      format: fileFormat,
    }),
    new winston.transports.Console({ 
      format: consoleFormat,
    }),
  ],

  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logDir, 'rejections.log'),
      format: fileFormat,
    }),
  ],
};