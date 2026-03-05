import { BaseRepository } from "./base.repository.ts";
import { type ModelStatic, Transaction, Op } from "@sequelize/core";
import { type CreateData, type FindOptions, type TransactionOptions } from "./repository.types.ts";
import type { PaymentSchedule } from "../models/payment-schedule.model.ts";


export class PaymentScheduleRepository extends BaseRepository<PaymentSchedule> {
  constructor(model: ModelStatic<PaymentSchedule>) {
    super(model);
  }

  async findAll(options?: FindOptions<PaymentSchedule> | undefined, txOptions?: TransactionOptions): Promise<PaymentSchedule[]> {
      
  }

  async findById(id: number | string, options?: TransactionOptions): Promise<PaymentSchedule | null> {
      
  }

  async create(data: CreateData<PaymentSchedule>, txOptions?: TransactionOptions): Promise<PaymentSchedule> {
       
  }
  
  async update(id: number | string, data: Partial<CreateData<PaymentSchedule>>, txOptions?: TransactionOptions): Promise<PaymentSchedule | null> {
      
  }
  async delete(id: number | string, txOptions?: TransactionOptions): Promise<boolean> {
      
  }
  
}
