// types/money-flow.types.ts

export type MoneyFlowDirection = 'inflow' | 'outflow' | 'transfer';

export type MoneyFlowCode = 
  | 'INCOME'           // доход
  | 'EXPENSE'          // расход
  | 'TRANSFER_IN'      // перевод на счет (входящий)
  | 'TRANSFER_OUT'     // перевод со счета (исходящий)
  | 'LOAN_RECEIVED'    // получение займа
  | 'LOAN_REPAID'      // погашение займа
  | 'DEBT_GIVEN'       // долг выдан
  | 'DEBT_RETURNED'    // долг возвращен
  | 'INVESTMENT'       // инвестиция
  | 'PROFIT'           // прибыль
  | 'INTEREST'         // проценты
  | 'FEE'              // комиссия
  | 'REFUND'           // возврат
  | 'CASHBACK';        // кэшбэк

export interface MoneyFlowType {
  id: number;
  code: MoneyFlowCode;
  name: string;
  direction: MoneyFlowDirection;
}