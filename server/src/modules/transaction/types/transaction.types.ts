// types/transaction.types.ts
import { Transactions } from '../../../../database/models/transactions.model.ts';
import { type TransactionOptions } from '../../../../database/repositories/repository.types.ts';

export interface TransactionWithAssociations extends Transactions {
  user: NonNullable<Transactions['user']>;
  wallet: NonNullable<Transactions['wallet']>;
  flowType: NonNullable<Transactions['flowType']>;
  status: NonNullable<Transactions['status']>;
  systemCategory?: Transactions['systemCategory'];
  userCategory?: Transactions['userCategory'];
  relatedTransaction?: Transactions;
}

export interface TransactionFilters {
  userId?: number;
  walletId?: number;
  startDate?: Date;
  endDate?: Date;
  moneyFlowTypeId?: number;
  statusId?: number;
  categoryId?: number;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  netFlow: number;
  transactionCount: number;
  averageTransaction: number;
}

export interface CategorySpending {
  categoryId: number;
  categoryName: string;
  categoryType: 'system' | 'user';
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export interface DailySummary {
  date: string;
  income: number;
  expense: number;
  net: number;
}

export interface CreateTransactionDTO {
  user_id: number;
  wallet_id: number;
  amount: number;
  money_flow_type_id: number;
  description?: string;
  operation_date?: Date;
  purchase_cat_id?: number;
  user_cat_id?: number;
  status_id?: number;
}

export interface CreateTransferDTO {
  fromWalletId: number;
  toWalletId: number;
  amount: number;
  description?: string;
  operation_date?: Date;
  userId: number;
}

export interface UpdateTransactionDTO {
  amount?: number;
  description?: string;
  operation_date?: Date;
  money_flow_type_id?: number;
  purchase_cat_id?: number;
  user_cat_id?: number;
  status_id?: number;
}