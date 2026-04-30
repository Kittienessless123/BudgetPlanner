import type { DebtsRepository } from "@repositories/debt.repository.ts";
import type { TransactionRepository } from "@repositories/transactions.repository.ts";
import type { NextFunction, Response, Request } from "express";

export class DebtsService {
  constructor(
     private debtRepo: DebtsRepository,
     private transactionRepo: TransactionRepository,
   ) {}
}
