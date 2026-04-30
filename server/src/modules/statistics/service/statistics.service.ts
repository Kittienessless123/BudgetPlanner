import type { TransactionRepository } from "@repositories/transactions.repository.ts";
import type { UserRepository } from "@repositories/users.repository.ts";
import type { WalletRepository } from "@repositories/wallet.repository.ts";
import type { NextFunction, Response, Request } from "express";

export class StatisticsService {
   constructor(
     private walletRepo: WalletRepository,
     private transactionRepo: TransactionRepository,
     private userRepo : UserRepository
   ) {}
}
