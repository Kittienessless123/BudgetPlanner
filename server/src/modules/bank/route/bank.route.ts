import { Router } from "express";
import { BankController } from "../controller/bank.controller.ts";
import { authMiddleware } from "@shared/middlewares/auth.middleware.ts";

const BankRouter = Router();
const bankController = new BankController();

BankRouter.get("/", bankController.getAllBanks.bind(bankController));

export default BankRouter;
