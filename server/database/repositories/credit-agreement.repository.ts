import { BaseRepository } from "./base.repository.ts";
import { type ModelStatic, Transaction, Op } from "@sequelize/core";
import { type CreateData, type FindOptions, type TransactionOptions } from "./repository.types.ts";
import type { CreditAgreement } from "../models/credit-agreements.model.ts";


export class CreditAgreementRepository extends BaseRepository<CreditAgreement> {
  constructor(model: ModelStatic<CreditAgreement>) {
    super(model);
  }

  async findAll(options?: FindOptions<CreditAgreement> | undefined, txOptions?: TransactionOptions): Promise<CreditAgreement[]> {
      
  }

  async findById(id: number | string, options?: TransactionOptions): Promise<CreditAgreement | null> {
      
  }

  async create(data: CreateData<CreditAgreement>, txOptions?: TransactionOptions): Promise<CreditAgreement> {
       
  }
  
  async update(id: number | string, data: Partial<CreateData<CreditAgreement>>, txOptions?: TransactionOptions): Promise<CreditAgreement | null> {
      
  }
  async delete(id: number | string, txOptions?: TransactionOptions): Promise<boolean> {
      
  }
  
}
