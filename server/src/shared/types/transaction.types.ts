// types/transaction.types.ts

import { type CurrencyCode } from './currency.types.ts';
import { type MoneyFlowCode } from './money-flow.types.ts';
import {type  PaymentStatusCode } from './payment-status.types.ts';

export type TransactionType = 'regular' | 'transfer' | 'debt' | 'credit';

export interface BaseTransaction {
  id: number;
  amount: number;
  description: string;
  operationDate: Date;
  moneyFlowType: MoneyFlowCode;
  status: PaymentStatusCode;
}

export interface RegularTransaction extends BaseTransaction {
  type: 'regular';
  categoryId: number;
  userCategoryId?: number;
}

export interface TransferTransaction extends BaseTransaction {
  type: 'transfer';
  fromWalletId: number;
  toWalletId: number;
  fee?: number;
}

export interface DebtTransaction extends BaseTransaction {
  type: 'debt';
  debtId: number;
  isRepayment: boolean;
}

export interface CreditTransaction extends BaseTransaction {
  type: 'credit';
  creditAgreementId: number;
  principalPart: number;
  interestPart: number;
}

export type Transaction = 
  | RegularTransaction 
  | TransferTransaction 
  | DebtTransaction 
  | CreditTransaction;