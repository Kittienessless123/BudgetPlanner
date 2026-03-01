// types/index.ts (расширенная версия)

// 1. Реэкспорт всего
export * from './currency.types.ts';
export * from './money-flow.types.ts';
export * from './payment-status.types.ts';
export * from './debt.types.ts';
export * from './credit.types.ts';
export * from './category.types.ts';
export * from './transaction.types.ts';
export * from './balance.types.ts';
export * from './db-enums.types.ts';

// 2. Группировка по неймспейсам для удобства
import * as CurrencyTypes from './currency.types.ts';
import * as MoneyFlowTypes from './money-flow.types.ts';
import * as PaymentStatusTypes from './payment-status.types.ts';
import * as DebtTypes from './debt.types.ts';
import * as CreditTypes from './credit.types.ts';
import * as CategoryTypes from './category.types.ts';
import * as TransactionTypes from './transaction.types.ts';
import * as BalanceTypes from './balance.types.ts';

export {
  CurrencyTypes,
  MoneyFlowTypes,
  PaymentStatusTypes,
  DebtTypes,
  CreditTypes,
  CategoryTypes,
  TransactionTypes,
  BalanceTypes
};

