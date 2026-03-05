import type { NextFunction, Response, Request } from "express";
import { WalletService } from "../service/wallet.service.ts";
require("dotenv").config();

export class WalletController {
  async getUserDataByPk(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;
    const walletService = new WalletService();
    const result = await walletService.getUserDataByPk(id);
    return result;
  }

  async getUserWallets(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;
    const walletService = new WalletService();
    const result = await walletService.getUserWallets(id);
    return result;
  }

  async getUserDebts(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;
    const walletService = new WalletService();
    const result = await walletService.getUserDebts(id);
    return result;
  }

  async userStats(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;
    const walletService = new WalletService();
    const result = await walletService.getUserStats(id);
    return result;
  }
}
