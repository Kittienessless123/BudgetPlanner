export type CreditStatus = 
  | 'ACTIVE'           // активный
  | 'CLOSED'           // закрыт
  | 'OVERDUE'          // просрочка
  | 'RESTRUCTURED'     // реструктуризирован
  | 'REFINANCED'       // рефинансирован
  | 'DEFAULT';         // дефолт

export type PaymentScheduleStatus = 
  | 'SCHEDULED'        // запланирован
  | 'PAID'             // оплачен
  | 'OVERDUE'          // просрочен
  | 'PARTIALLY_PAID';  // частично оплачен

export interface CreditAgreement {
  id: number;
  contractNumber: string;
  principalAmount: number;
  currentPrincipal: number;
  status: CreditStatus;
}