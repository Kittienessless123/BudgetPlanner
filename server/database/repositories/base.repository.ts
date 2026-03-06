// base/base.repository.ts
import {
  Model,
  type ModelStatic,
  Transaction,
  type WhereOptions,
  type FindOptions as SequelizeFindOptions,
} from "@sequelize/core";
import type {
  IRepository,
  FindOptions as IFindOptions,
  CreateData,
  UpdateData,
  TransactionOptions,
} from "./repository.types.ts";

export abstract class BaseRepository<
  T extends Model,
> implements IRepository<T> {
  constructor(protected model: ModelStatic<T>) {}

  async findById(
    id: number | string,
    options?: TransactionOptions,
  ): Promise<T | null> {
    try {
      return await this.model.findByPk(id, {
        transaction: options?.transaction,
      });
    } catch (error) {
      throw new Error(`Error in findById: ${error}`);
    }
  }

  async findOne(
    options: IFindOptions<T>,
    txOptions?: TransactionOptions,
  ): Promise<T | null> {
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
    options?: IFindOptions<T>,
    txOptions?: TransactionOptions,
  ): Promise<T[]> {
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
    data: CreateData<T>,
    txOptions?: TransactionOptions,
  ): Promise<T> {
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
    data: UpdateData<T>,
    txOptions?: TransactionOptions,
  ): Promise<T | null> {
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
    where?: Partial<T["_attributes"]>,
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

  async transaction<R>(callback: (t: Transaction) => Promise<R>): Promise<R> {
    if (!this.model.sequelize) {
      throw new Error("Sequelize instance not found");
    }
    return this.model.sequelize.transaction(callback);
  }
}
