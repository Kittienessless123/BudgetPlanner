import { CreditAgreementRepository } from "@repositories/credit-agreement.repository.ts";
import type { TransactionRepository } from "@repositories/transactions.repository.ts";
import type { NextFunction, Response, Request } from "express";

export class CreditService {
  constructor(
    private craRepo: CreditAgreementRepository,
    private transactionRepo: TransactionRepository,
  ) {}
}
