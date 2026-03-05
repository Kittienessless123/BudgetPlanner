import { BaseRepository } from "./base.repository.ts";
import { type ModelStatic, Transaction, Op } from "@sequelize/core";
import { type CreateData, type FindOptions, type TransactionOptions } from "./repository.types.ts";
import type { CreditPayments } from "../models/credit-payments.model.ts";


export class CreditRepository extends BaseRepository<CreditPayments> {
  constructor(model: ModelStatic<CreditPayments>) {
    super(model);
  }

  async findAll(options?: FindOptions<CreditPayments> | undefined, txOptions?: TransactionOptions): Promise<CreditPayments[]> {
      
  }

  async findById(id: number | string, options?: TransactionOptions): Promise<CreditPayments | null> {
      
  }

  async create(data: CreateData<CreditPayments>, txOptions?: TransactionOptions): Promise<CreditPayments> {
       
  }
  
  async update(id: number | string, data: Partial<CreateData<CreditPayments>>, txOptions?: TransactionOptions): Promise<CreditPayments | null> {
      
  }
  async delete(id: number | string, txOptions?: TransactionOptions): Promise<boolean> {
      
  }
  
}
