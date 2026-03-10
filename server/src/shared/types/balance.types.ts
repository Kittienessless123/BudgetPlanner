export type BalanceChangeReason = 
  | 'transaction'
  | 'correction'
  | 'initial'
  | 'interest'
  | 'fee'
  | 'exchange';

export interface BalanceHistory {
  id: number;
  walletId: number;
  balance: number;
  changedAt: Date;
  transactionId?: number;
  reason: BalanceChangeReason;
  comment?: string;
}