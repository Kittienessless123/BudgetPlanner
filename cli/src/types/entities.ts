export class UserEntity {
  id!: string;
  email!: string;
  passwordHash!: string;
  name!: string;
  defaultCurrency!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class WalletEntity {
  id!: string;
  userId!: string;
  name!: string;
  currency!: string;
  currentBalance!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class WalletBalanceHistoryEntity {
  id!: string;
  walletId!: string;
  balance!: number;
  changedAt!: Date;
  transactionId!: string | null;
  reason!: string | null;
}

export class TransactionEntity {
  id!: string;
  userId!: string;
  walletId!: string;
  amount!: number;
  description!: string | null;
  operationDate!: Date;
  moneyFlowTypeId!: string;
  statusId!: string;
  purchaseCatId!: string | null;
  userCatId!: string | null;
  relatedTxId!: string | null;
  createdAt!: Date;
}

export class MoneyFlowTypeEntity {
  id!: string;
  code!: string;
  name!: string;
  direction!: 'income' | 'expense' | 'transfer';
}

export class PaymentStatusEntity {
  id!: string;
  code!: string;
  name!: string;
}

export class DebtEntity {
  id!: string;
  userId!: string;
  personName!: string;
  direction!: 'borrowed' | 'lent';
  currentBalance!: number;
  initialTxId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class CreditAgreementEntity {
  id!: string;
  userId!: string;
  bankId!: string;
  contractNumber!: string;
  principalAmount!: number;
  currentPrincipal!: number;
  status!: 'active' | 'closed' | 'defaulted';
  createdAt!: Date;
  updatedAt!: Date;
}

export class CreditPaymentEntity {
  id!: string;
  creditAgreeId!: string;
  transactionId!: string;
  paymentDate!: Date;
  principalAmount!: number;
  interestAmount!: number;
}

export class PaymentScheduleEntity {
  id!: string;
  creditAgreeId!: string;
  scheduledDate!: Date;
  scheduledTotal!: number;
  paymentId!: string | null;
  paymentStatus!: 'pending' | 'paid' | 'overdue';
}

export class PurchaseCategoryEntity {
  id!: string;
  name!: string;
  parentId!: string | null;
  isActive!: boolean;
}

export class UserPurchaseCategoryEntity {
  id!: string;
  userId!: string;
  name!: string;
  parentId!: string | null;
  parentType!: 'system' | 'user';
}

export class BankEntity {
  id!: string;
  name!: string;
  code!: string | null;
  country!: string | null;
}
export class UserBankEntity {
  id!: string;
  name!: string;
  code!: string | null;
  country!: string | null;
  userId!: string | null;
}

export class SettingsEntity {
  id!: string;
  userId!: string;
  key!: string;
  value: any;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ReportEntity {
  id!: string;
  userId!: string;
  type!: string;
  parameters: any;
  filePath!: string | null;
  generatedAt!: Date;
}

export class ScheduleEntity {
  id!: string;
  userId!: string;
  name!: string;
  cronExpression!: string;
  action!: string;
  parameters: any;
  isActive!: boolean;
  lastRunAt!: Date | null;
  nextRunAt!: Date | null;
  createdAt!: Date;
}

export class StatisticEntity {
  id!: string;
  userId!: string;
  period!: 'day' | 'week' | 'month' | 'year';
  startDate!: Date;
  endDate!: Date;
  totalIncome!: number;
  totalExpenses!: number;
  netSavings!: number;
  categoryBreakdown: any;
  generatedAt!: Date;
}