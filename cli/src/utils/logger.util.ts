import winston from 'winston';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

const logDir = path.join(process.cwd(), 'logs');

// Создаем папку для логов
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Формат для консоли (с цветами)
const consoleFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  const time = chalk.gray(`[${timestamp}]`);
  
  let coloredLevel;
  switch (level) {
    case 'error':
      coloredLevel = chalk.red.bold('ERROR');
      break;
    case 'warn':
      coloredLevel = chalk.yellow.bold('WARN');
      break;
    case 'info':
      coloredLevel = chalk.cyan.bold('INFO');
      break;
    case 'debug':
      coloredLevel = chalk.magenta.bold('DEBUG');
      break;
    default:
      coloredLevel = level;
  }

  const metaStr = Object.keys(meta).length ? `\n${chalk.gray(JSON.stringify(meta, null, 2))}` : '';
  return `${time} ${coloredLevel} ${message}${metaStr}`;
});

// CLI логгер
export const cliLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.errors({ stack: true })
  ),
  transports: [
    // В консоль с цветами
    new winston.transports.Console({
      format: consoleFormat,
    }),
    // В файл все логи
    new winston.transports.File({
      filename: path.join(logDir, 'cli.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      maxsize: 5242880,
      maxFiles: 3,
    }),
  ],
});

// Утилиты для CLI
export const log = {
  success: (msg: string) => console.log(chalk.green('✓'), msg),
  error: (msg: string) => console.log(chalk.red('✗'), msg),
  warn: (msg: string) => console.log(chalk.yellow('⚠'), msg),
  info: (msg: string) => console.log(chalk.cyan('ℹ'), msg),
  data: (msg: string) => console.log(chalk.gray(msg)),
  
  // С логированием в файл
  action: async (action: string, fn: () => Promise<any>) => {
    cliLogger.info(`Начало: ${action}`);
    try {
      const result = await fn();
      cliLogger.info(`Успех: ${action}`);
      return result;
    } catch (error) {
      cliLogger.error(`Ошибка: ${action}`, { error });
      throw error;
    }
  }
};

// Пример использования в CLI командах
export const withLogging = async (command: string, fn: () => Promise<void>) => {
  cliLogger.info(`▶️ Выполняется команда: ${command}`);
  const start = Date.now();
  
  try {
    await fn();
    const duration = Date.now() - start;
    cliLogger.info(`✅ Команда выполнена за ${duration}ms`);
  } catch (error) {
    const duration = Date.now() - start;
    cliLogger.error(`❌ Ошибка выполнения команды за ${duration}ms`, { error });
    throw error;
  }
};