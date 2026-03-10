export const CurrencyEnum = [
  'RUB', 'USD', 'EUR', 'GBP', 'CNY', 'JPY',
  'KZT', 'BYN', 'UAH', 'CHF', 'CAD', 'AUD'
] as const;

export const MoneyFlowEnum = [
  'INCOME', 'EXPENSE', 'TRANSFER_IN', 'TRANSFER_OUT',
  'LOAN_RECEIVED', 'LOAN_REPAID', 'DEBT_GIVEN', 'DEBT_RETURNED'
] as const;

export const PaymentStatusEnum = [
  'PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'PROCESSING'
] as const;

export const DebtDirectionEnum = ['lent', 'borrowed'] as const;

export const CreditStatusEnum = [
  'ACTIVE', 'CLOSED', 'OVERDUE', 'RESTRUCTURED'
] as const;