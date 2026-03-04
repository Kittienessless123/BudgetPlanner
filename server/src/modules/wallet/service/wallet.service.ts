import type { NextFunction, Response, Request } from "express";
import { WalletRepository } from "../../../../database/repositories/wallet.repository.ts";
import { DebtRepository } from "../../../../database/repositories/debt.repository.ts";
require("dotenv").config();

export class WalletService {
  async getUserDataByPk(id: number) {
    const walletRepo = new WalletRepository();
  }

  async getUserWallets(id: number) {
    const walletRepo = new WalletRepository();
  }

  async getUserDebts(id: number) {
    const walletRepo = new WalletRepository();
  }

  async getUserStats(id: number) {
    const walletRepo = new WalletRepository();
  }
}
