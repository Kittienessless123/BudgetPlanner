import { BaseRepository } from "./base.repository.ts";
import { type ModelStatic, Transaction, Op } from "@sequelize/core";
import { type CreateData, type FindOptions, type TransactionOptions } from "./repository.types.ts";
import type { Debts } from "../models/debts.model.ts";


export class DebtsRepository extends BaseRepository<Debts> {
  constructor(model: ModelStatic<Debts>) {
    super(model);
  }

  async findAll(options?: FindOptions<Debts> | undefined, txOptions?: TransactionOptions): Promise<Debts[]> {
      
  }

  async findById(id: number | string, options?: TransactionOptions): Promise<Debts | null> {
      
  }

  async create(data: CreateData<Debts>, txOptions?: TransactionOptions): Promise<Debts> {
       
  }
  
  async update(id: number | string, data: Partial<CreateData<Debts>>, txOptions?: TransactionOptions): Promise<Debts | null> {
      
  }
  async delete(id: number | string, txOptions?: TransactionOptions): Promise<boolean> {
      
  }
  
}
