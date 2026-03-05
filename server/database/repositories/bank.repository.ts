import { BaseRepository } from "./base.repository.ts";
import { type ModelStatic, Transaction, Op } from "@sequelize/core";
import { type CreateData, type FindOptions, type TransactionOptions } from "./repository.types.ts";
import type { Bank } from "../models/bank.model.ts";


export class BankRepository extends BaseRepository<Bank> {
  constructor(model: ModelStatic<Bank>) {
    super(model);
  }

  async findAll(options?: FindOptions<Bank> | undefined, txOptions?: TransactionOptions): Promise<Bank[]> {
      
  }

  async findById(id: number | string, options?: TransactionOptions): Promise<Bank | null> {
      
  }

  async create(data: CreateData<Bank>, txOptions?: TransactionOptions): Promise<Bank> {
       
  }
  
  async update(id: number | string, data: Partial<CreateData<Bank>>, txOptions?: TransactionOptions): Promise<Bank | null> {
      
  }
  async delete(id: number | string, txOptions?: TransactionOptions): Promise<boolean> {
      
  }
  
}
