import express from "express";
import { httpLogger, errorLogger } from "../logs/logger.middleware.ts";
import { LoggerService } from "../logs/logger.service.ts";
import { setupDI } from "@di/setup.ts";
import AuthRouter from "@modules/auth/route/auth.routes.ts";
import UserRouter from "@modules/user/route/user.router.ts";

const server = express();
const logger = new LoggerService("APP");

// Логируем запуск
logger.info("🚀 Инициализация приложения...");

server.use(httpLogger);
setupDI();

server.get("/", (req, res) => {
  logger.debug("Кто-то зашел на главную");
  res.send("Hello World");
});

server.use(errorLogger);

server.use("/auth", AuthRouter);
server.use("/users", UserRouter);
server.get("/health", (req, res) => res.send("OK"));

server.use((err: any, req: express.Request, res: express.Response) => {
  logger.error("404 error", err);
  res.status(404).json({ message: "Not Found" });
});

server.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    logger.error("Необработанная ошибка:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  },
);

export default server;
