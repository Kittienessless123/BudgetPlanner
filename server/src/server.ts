import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { httpLogger, errorLogger } from "../logs/logger.middleware.ts";
import { LoggerService } from "../logs/logger.service.ts";
import { setupDI } from "@di/setup.ts";
import AuthRouter from "@modules/auth/route/auth.routes.ts";
import UserRouter from "@modules/user/route/user.router.ts";
import userBankRouter from "@modules/usersbanks/route/ub.route.ts";
import BankRouter from "@modules/bank/route/bank.route.ts";
import categoryReferenceRouter from "@modules/category/route/category-reference.route.ts";
import categoryUserRouter from "@modules/category/route/users-category.route.ts";

const server = express();
const logger = new LoggerService("APP");
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

logger.info("🚀 Инициализация приложения...");

server.use(helmet());
server.use(cors(corsOptions));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

server.use(httpLogger);

setupDI();

server.get("/", (req, res) => {
  logger.debug("Кто-то зашел на главную");
  res.send("Hello World");
});

server.get("/health", (req, res) => res.status(200).send("OK"));

server.use("/auth", AuthRouter);
server.use("/users", UserRouter);
server.use("/banks", BankRouter);

server.use("/categories/reference", categoryReferenceRouter);
server.use("/users/categories", categoryUserRouter);
server.use("/users/banks", userBankRouter);

server.use((req: express.Request, res: express.Response) => {
  logger.warn(`404 - Маршрут не найден: ${req.method} ${req.url}`);
  res.status(404).json({ message: "Not Found" });
});

server.use(errorLogger);

server.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    logger.error("Необработанная ошибка:", err);

    const status = err.status || 500;
    const message = err.message || "Внутренняя ошибка сервера";

    const response =
      process.env.NODE_ENV === "production"
        ? { error: message }
        : { error: message, stack: err.stack };

    res.status(status).json(response);
  },
);

export default server;
