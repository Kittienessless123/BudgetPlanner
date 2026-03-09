import { BaseRepository } from "./base.repository.ts";
import {
  type ModelStatic,
  Transaction,
  Op,
  type WhereOptions,
} from "@sequelize/core";
import {
  type CreateData,
  type FindOptions,
  type TransactionOptions,
} from "./repository.types.ts";
import { Bank } from "@models/bank.model.ts";

export class BankRepository extends BaseRepository<Bank> {
  constructor(model: ModelStatic<Bank>) {
    super(model);
  }

  async findAll(
    options?: FindOptions<Bank> | undefined,
    txOptions?: TransactionOptions,
  ): Promise<Bank[]> {
    try {
      return await Bank.findAll({
        where: options?.where as WhereOptions,
        limit: options?.limit,
        offset: options?.offset,
        order: options?.order,
        transaction: txOptions?.transaction,
      });
    } catch (error) {
      throw new Error(`Error in findAll: ${error}`);
    }
  }

  async findById(
    id: number | string,
    options?: TransactionOptions,
  ): Promise<Bank | null> {
    try {
      return await Bank.findByPk(id, {
        transaction: options?.transaction,
      });
    } catch (error) {
      throw new Error(`Error in findById: ${error}`);
    }
  }

  async create(
    data: CreateData<Bank>,
    txOptions?: TransactionOptions,
  ): Promise<Bank> {
    try {
      return await this.model.create(data as any, {
        transaction: txOptions?.transaction,
      });
    } catch (error) {
      throw new Error(`Error in create: ${error}`);
    }
  }

  async update(
    id: number | string,
    data: Partial<CreateData<Bank>>,
    txOptions?: TransactionOptions,
  ): Promise<Bank | null> {
    try {
      const record = await this.findById(id, txOptions);
      if (!record) return null;

      await record.update(data, {
        transaction: txOptions?.transaction,
      });
      return record;
    } catch (error) {
      throw new Error(`Error in update: ${error}`);
    }
  }

  async delete(
    id: number | string,
    txOptions?: TransactionOptions,
  ): Promise<boolean> {
    const deleted = await Bank.destroy({
      where: {
        id: id,
      },
      transaction: txOptions?.transaction,
    });
    return deleted > 0;
  }
}
