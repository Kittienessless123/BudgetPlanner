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
import type { UsersPCategory } from "@models/users-p-cat.model.ts";

export class CategoryRepository extends BaseRepository<UsersPCategory> {
  constructor(model: ModelStatic<UsersPCategory>) {
    super(model);
  }

  async findAll(
    options?: FindOptions<UsersPCategory> | undefined,
    txOptions?: TransactionOptions,
  ): Promise<UsersPCategory[]> {
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

  async findById(
    id: number | string,
    options?: TransactionOptions,
  ): Promise<UsersPCategory | null> {
    try {
      return await this.model.findByPk(id, {
        transaction: options?.transaction,
      });
    } catch (error) {
      throw new Error(`Error in findById: ${error}`);
    }
  }

  async findByUserId(
    id: number,
    options?: TransactionOptions,
  ): Promise<UsersPCategory[]> {
    return this.findAll(
      {
        where: { user_id: id },
      },
      options,
    );
  }

  async findOne(
    options: FindOptions<UsersPCategory>,
    txOptions?: TransactionOptions,
  ): Promise<UsersPCategory | null> {
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
    data: CreateData<UsersPCategory>,
    txOptions?: TransactionOptions,
  ): Promise<UsersPCategory> {
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
    data: Partial<CreateData<UsersPCategory>>,
    txOptions?: TransactionOptions,
  ): Promise<UsersPCategory | null> {
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
    where?: Partial<UsersPCategory["_attributes"]>,
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

  async findByNameAndUser(
    name: string,
    userId: number,
    options?: TransactionOptions,
  ): Promise<UsersPCategory | null> {
    try {
      return await this.model.findOne({
        where: {
          name,
          user_id: userId,
        } as WhereOptions,
        transaction: options?.transaction,
      });
    } catch (error) {
      throw new Error(`Error in findByNameAndUser: ${error}`);
    }
  }

  async findByParent(
    parentId: number,
    parentType: string,
    userId?: number,
    options?: TransactionOptions,
  ): Promise<UsersPCategory[]> {
    try {
      const where: any = {
        parent_id: parentId,
        parent_type: parentType,
      };

      if (userId) {
        where.user_id = userId;
      }

      return await this.model.findAll({
        where,
        transaction: options?.transaction,
      });
    } catch (error) {
      throw new Error(`Error in findByParent: ${error}`);
    }
  }

  async findSystemCategories(
    options?: TransactionOptions,
  ): Promise<UsersPCategory[]> {
    try {
      return await this.model.findAll({
        where: { parent_type: "system" } as WhereOptions,
        transaction: options?.transaction,
      });
    } catch (error) {
      throw new Error(`Error in findSystemCategories: ${error}`);
    }
  }

  async deleteByUserId(
    userId: number,
    options?: TransactionOptions,
  ): Promise<number> {
    try {
      return await this.model.destroy({
        where: { user_id: userId } as WhereOptions,
        transaction: options?.transaction,
      });
    } catch (error) {
      throw new Error(`Error in deleteByUserId: ${error}`);
    }
  }
}
