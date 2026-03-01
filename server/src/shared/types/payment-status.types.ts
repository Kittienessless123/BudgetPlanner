// types/payment-status.types.ts

export type PaymentStatusCode = 
  | 'PENDING'           // ожидает
  | 'COMPLETED'         // завершен
  | 'FAILED'            // неуспешно
  | 'CANCELLED'         // отменен
  | 'PROCESSING'        // в обработке
  | 'ON_HOLD'           // на удержании
  | 'REFUNDED'          // возвращен
  | 'PARTIALLY_REFUNDED' // частично возвращен
  | 'EXPIRED';          // истек

export interface PaymentStatus {
  id: number;
  code: PaymentStatusCode;
  name: string;
}