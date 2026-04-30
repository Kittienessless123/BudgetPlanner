// server-minimal.ts
import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import { setupDI } from "@di/setup.js";
import { Container } from "@di/container.js";

setupDI();

import { AuthService } from "@modules/auth/service/auth.service.ts";
import { AuthController } from "@modules/auth/controller/auth.controller.ts";
import { createAuthRouter } from "@modules/auth/route/auth.routes.ts";

const authService = Container.get<AuthService>("AuthService");
const authController = new AuthController(authService);
const authRouter = createAuthRouter(authController);

const server = express();
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};
server.use(helmet());
server.use(cors(corsOptions));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

server.use("/auth", authRouter);

server.get("/", (req, res) => {
  res.send("Hello World");
});

server.get("/health", (req, res) => res.status(200).send("OK"));

export default server;
