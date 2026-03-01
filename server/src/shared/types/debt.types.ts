// types/debt.types.ts

export type DebtDirection = 'lent' | 'borrowed'; // я дал в долг / я взял в долг

export type DebtStatus = 
  | 'ACTIVE'
  | 'PARTIALLY_REPAID'
  | 'REPAID'
  | 'OVERDUE'
  | 'WRITTEN_OFF';

export interface Debt {
  id: number;
  personName: string;
  direction: DebtDirection;
  currentBalance: number;
}