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
import { PaymentStatuses } from "@models/payment-statuses.model.ts";

export class StatusesRepository extends BaseRepository<PaymentStatuses> {
  constructor(model: ModelStatic<PaymentStatuses>) {
    super(model);
  }

  async findAll(
    options?: FindOptions<PaymentStatuses> | undefined,
    txOptions?: TransactionOptions,
  ): Promise<PaymentStatuses[]> {
    try {
      return await PaymentStatuses.findAll({
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
  ): Promise<PaymentStatuses | null> {
    try {
      return await PaymentStatuses.findByPk(id, {
        transaction: options?.transaction,
      });
    } catch (error) {
      throw new Error(`Error in findById: ${error}`);
    }
  }

  async findOne(
    options: FindOptions<PaymentStatuses>,
    txOptions?: TransactionOptions,
  ): Promise<PaymentStatuses | null> {
    try {
      return await this.model.findOne({
        where: options.where as WhereOptions,
        transaction: txOptions?.transaction,
      });
    } catch (error) {
      throw new Error(`Error in findOne: ${error}`);
    }
  }

  async create(
    data: CreateData<PaymentStatuses>,
    txOptions?: TransactionOptions,
  ): Promise<PaymentStatuses> {
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
    data: Partial<CreateData<PaymentStatuses>>,
    txOptions?: TransactionOptions,
  ): Promise<PaymentStatuses | null> {
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
    const deleted = await PaymentStatuses.destroy({
      where: {
        id: id,
      },
      transaction: txOptions?.transaction,
    });
    return deleted > 0;
  }
}
