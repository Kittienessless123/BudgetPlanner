import express from 'express';
import { httpLogger, errorLogger } from '../logs/logger.middleware.ts';
import { LoggerService } from '../logs/logger.service.ts';

const server = express();
const logger = new LoggerService('APP');

// Логируем запуск
logger.info('🚀 Инициализация приложения...');

// Подключаем middleware для логирования HTTP
server.use(httpLogger);

// Ваши роуты
server.get('/', (req, res) => {
  logger.debug('Кто-то зашел на главную');
  res.send('Hello World');
});

// Логирование ошибок
server.use(errorLogger);

// Обработка ошибок
server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {

  logger.error('Необработанная ошибка:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

export default server;