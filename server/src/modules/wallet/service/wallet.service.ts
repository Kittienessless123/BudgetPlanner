import type { NextFunction, Response, Request } from "express";
import { WalletRepository } from "../../../../database/repositories/wallet.repository.ts";
import type { TransactionRepository } from "@repositories/transactions.repository.ts";
require("dotenv").config();

export class WalletService {
  constructor(
      private transactionRepo: TransactionRepository,
      private walletRepository: WalletRepository,
    ) {}
    

  async getUserWallets(id: number) {

  }

  async getUserDebts(id: number) {

  }

  async getUserStats(id: number) {

  }
}
