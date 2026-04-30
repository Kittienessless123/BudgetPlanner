import type { TransactionRepository } from "@repositories/transactions.repository.ts";
import type { WalletRepository } from "@repositories/wallet.repository.ts";
import type { NextFunction, Response, Request } from "express";

export class TransactionService {
  constructor(
    private transactionRepo: TransactionRepository,
    private walletRepository: WalletRepository,
  ) {}
}
