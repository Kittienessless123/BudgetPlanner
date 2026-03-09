import { BaseRepository } from "./base.repository.ts";
import {
  type ModelStatic,
  type WhereOptions,
} from "@sequelize/core";
import {
  type CreateData,
  type FindOptions,
  type TransactionOptions,
  type UpdateData,
} from "./repository.types.ts";
import type { Wallet } from "@models/wallet.model.ts";

export class WalletRepository extends BaseRepository<Wallet> {
  constructor(model: ModelStatic<Wallet>) {
    super(model);
  }

  async findById(
    id: number | string,
    options?: TransactionOptions,
  ): Promise<Wallet | null> {
    try {
      return await this.model.findByPk(id, {
        transaction: options?.transaction,
      });
    } catch (error) {
      throw new Error(`Error in findById: ${error}`);
    }
  }

  async findOne(
    options: FindOptions<Wallet>,
    txOptions?: TransactionOptions,
  ): Promise<Wallet | null> {
    try {
      return await this.model.findOne({
        where: options.where as WhereOptions,
        transaction: txOptions?.transaction,
      });
    } catch (error) {
      throw new Error(`Error in findOne: ${error}`);
    }
  }

  async findAll(
    options?: FindOptions<Wallet>,
    txOptions?: TransactionOptions,
  ): Promise<Wallet[]> {
    try {
      return await this.model.findAll({
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

  async create(
    data: CreateData<Wallet>,
    txOptions?: TransactionOptions,
  ): Promise<Wallet> {
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
    data: UpdateData<Wallet>,
    txOptions?: TransactionOptions,
  ): Promise<Wallet | null> {
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
    try {
      const deleted = await this.model.destroy({
        where: { id } as WhereOptions,
        transaction: txOptions?.transaction,
      });
      return deleted > 0;
    } catch (error) {
      throw new Error(`Error in delete: ${error}`);
    }
  }

  async count(
    where?: Partial<Wallet["_attributes"]>,
    txOptions?: TransactionOptions,
  ): Promise<number> {
    try {
      return await this.model.count({
        where: where as WhereOptions,
        transaction: txOptions?.transaction,
      });
    } catch (error) {
      throw new Error(`Error in count: ${error}`);
    }
  }
}
