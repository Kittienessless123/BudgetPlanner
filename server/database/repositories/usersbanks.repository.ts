import { BaseRepository } from "./base.repository.ts";
import { type ModelStatic, Op, type WhereOptions } from "@sequelize/core";
import {
  type TransactionOptions,
  RepositoryError,
} from "./repository.types.ts";
import { UserBank } from "@models/usersbanks.model.ts";
import { Bank } from "@models/bank.model.ts";

export interface CreateUserBankDTO {
  user_id: number;
  bank_id: number;
  account_number: string;
  account_name?: string | null;
  is_primary?: boolean;
  last_sync_at?: Date | null;
}

export class UserBankRepository extends BaseRepository<UserBank> {
  constructor(model: ModelStatic<UserBank>) {
    super(model);
  }

  async findByUserId(
    userId: number,
    options?: TransactionOptions,
  ): Promise<UserBank[]> {
    try {
      return await this.model.findAll({
        where: { user_id: userId } as WhereOptions,
        include: [
          {
            model: Bank,
            as: "bank",
            required: true,
          },
        ],
        order: [
          ["is_primary", "DESC"],
          ["createdAt", "DESC"],
        ],
        transaction: options?.transaction,
      });
    } catch (error) {
      throw new RepositoryError(
        "Failed to find user banks",
        error,
        "findByUserId",
        "UserBank",
        { userId },
      );
    }
  }

  async findUserBank(
    userId: number,
    bankId: number,
    options?: TransactionOptions,
  ): Promise<UserBank | null> {
    try {
      return await this.model.findOne({
        where: {
          user_id: userId,
          bank_id: bankId,
        } as WhereOptions,
        include: [
          {
            model: Bank,
            as: "bank",
          },
        ],
        transaction: options?.transaction,
      });
    } catch (error) {
      throw new RepositoryError(
        "Failed to find user bank",
        error,
        "findUserBank",
        "UserBank",
        { userId, bankId },
      );
    }
  }

  async findByIdWithBank(
    id: number,
    options?: TransactionOptions,
  ): Promise<UserBank | null> {
    try {
      return await this.model.findByPk(id, {
        include: [
          {
            model: Bank,
            as: "bank",
          },
        ],
        transaction: options?.transaction,
      });
    } catch (error) {
      throw new RepositoryError(
        "Failed to find user bank by id",
        error,
        "findByIdWithBank",
        "UserBank",
        { id },
      );
    }
  }

  async addUserBank(
    data: CreateUserBankDTO,
    options?: TransactionOptions,
  ): Promise<UserBank> {
    try {
      const existingBanks = await this.findByUserId(data.user_id, options);
      const isPrimary =
        existingBanks.length === 0 ? true : (data.is_primary ?? false);

      if (isPrimary) {
        await this.model.update(
          { is_primary: false },
          {
            where: { user_id: data.user_id } as WhereOptions,
            transaction: options?.transaction,
          },
        );
      }

      return await this.model.create(
        {
          user_id: data.user_id,
          bank_id: data.bank_id,
          account_number: data.account_number,
          account_name: data.account_name || null,
          is_primary: isPrimary,
          last_sync_at: data.last_sync_at || null,
        } as any,
        { transaction: options?.transaction },
      );
    } catch (error) {
      throw new RepositoryError(
        "Failed to add user bank",
        error,
        "addUserBank",
        "UserBank",
        data,
      );
    }
  }

  async updateUserBank(
    id: number,
    data: Partial<Omit<CreateUserBankDTO, "user_id" | "bank_id">> & {
      is_primary?: boolean;
    },
    options?: TransactionOptions,
  ): Promise<UserBank | null> {
    try {
      const userBank = await this.findById(id, options);
      if (!userBank) return null;

      if (data.is_primary === true) {
        await this.model.update(
          { is_primary: false },
          {
            where: {
              user_id: userBank.user_id,
              id: { [Op.ne]: id },
            } as WhereOptions,
            transaction: options?.transaction,
          },
        );
      }

      await userBank.update(data, { transaction: options?.transaction });
      return userBank;
    } catch (error) {
      throw new RepositoryError(
        "Failed to update user bank",
        error,
        "updateUserBank",
        "UserBank",
        { id, ...data },
      );
    }
  }

  async removeUserBank(
    id: number,
    options?: TransactionOptions,
  ): Promise<boolean> {
    try {
      const userBank = await this.findById(id, options);
      if (!userBank) return false;

      const wasPrimary = userBank.is_primary;

      await userBank.destroy({ transaction: options?.transaction });

      if (wasPrimary) {
        const remainingBanks = await this.findByUserId(
          userBank.user_id,
          options,
        );
        if (remainingBanks.length > 0) {
          const newPrimary = remainingBanks[0];
          await newPrimary!.update(
            { is_primary: true },
            { transaction: options?.transaction },
          );
        }
      }

      return true;
    } catch (error) {
      throw new RepositoryError(
        "Failed to remove user bank",
        error,
        "removeUserBank",
        "UserBank",
        { id },
      );
    }
  }

  async findPrimaryBank(
    userId: number,
    options?: TransactionOptions,
  ): Promise<UserBank | null> {
    try {
      return await this.model.findOne({
        where: {
          user_id: userId,
          is_primary: true,
        } as WhereOptions,
        include: [
          {
            model: Bank,
            as: "bank",
          },
        ],
        transaction: options?.transaction,
      });
    } catch (error) {
      throw new RepositoryError(
        "Failed to find primary bank",
        error,
        "findPrimaryBank",
        "UserBank",
        { userId },
      );
    }
  }

  async hasBank(
    userId: number,
    bankId: number,
    options?: TransactionOptions,
  ): Promise<boolean> {
    try {
      const count = await this.model.count({
        where: {
          user_id: userId,
          bank_id: bankId,
        } as WhereOptions,
        transaction: options?.transaction,
      });
      return count > 0;
    } catch (error) {
      throw new RepositoryError(
        "Failed to check if user has bank",
        error,
        "hasBank",
        "UserBank",
        { userId, bankId },
      );
    }
  }
}
