import { BaseRepository } from "./base.repository.ts";
import { type ModelStatic, Transaction, Op } from "@sequelize/core";
import { type CreateData, type FindOptions, type TransactionOptions } from "./repository.types.ts";
import type { UsersPCategory } from "../models/users-p-cat.model.ts";


export class BankRepository extends BaseRepository<UsersPCategory> {
  constructor(model: ModelStatic<UsersPCategory>) {
    super(model);
  }

  async findAll(options?: FindOptions<UsersPCategory> | undefined, txOptions?: TransactionOptions): Promise<UsersPCategory[]> {
      
  }

  async findById(id: number | string, options?: TransactionOptions): Promise<UsersPCategory | null> {
      
  }

  async create(data: CreateData<UsersPCategory>, txOptions?: TransactionOptions): Promise<UsersPCategory> {
       
  }
  
  async update(id: number | string, data: Partial<CreateData<UsersPCategory>>, txOptions?: TransactionOptions): Promise<UsersPCategory | null> {
      
  }
  async delete(id: number | string, txOptions?: TransactionOptions): Promise<boolean> {
      
  }
  
}
