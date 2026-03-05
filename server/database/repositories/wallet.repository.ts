import { BaseRepository } from "./base.repository.ts";
import { type ModelStatic, Transaction, Op } from "@sequelize/core";
import { type CreateData, type FindOptions, type TransactionOptions } from "./repository.types.ts";
import type { Wallet } from "../models/wallet.model.ts";


export class WalletRepository extends BaseRepository<Wallet> {
  constructor(model: ModelStatic<Wallet>) {
    super(model);
  }

  async findAll(options?: FindOptions<Wallet> | undefined, txOptions?: TransactionOptions): Promise<Wallet[]> {
      
  }

  async findById(id: number | string, options?: TransactionOptions): Promise<Wallet | null> {
      
  }

  async create(data: CreateData<Wallet>, txOptions?: TransactionOptions): Promise<Wallet> {
       
  }
  
  async update(id: number | string, data: Partial<CreateData<Wallet>>, txOptions?: TransactionOptions): Promise<Wallet | null> {
      
  }
  async delete(id: number | string, txOptions?: TransactionOptions): Promise<boolean> {
      
  }
  
}
