export type DebtDirection = 'lent' | 'borrowed';

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