import { BaseRepository } from "./base.repository.ts";
import { User } from "@models/user.model.ts";
import { Transaction, type ModelStatic } from "@sequelize/core";
import { compare, hash } from "bcrypt";
import type { TransactionOptions } from "./repository.types.ts";

type UserWithAssociations = User & {
  wallets?: any[];
  transactions?: any[];
  debts?: any[];
  creditAgreements?: any[];
};

export interface UserStats {
  totalTransactions: number;
  totalWallets: number;
  totalDebts: number;
  totalCreditAgreements: number;
  lastActive: Date | null;
}

export class UserRepository extends BaseRepository<User> {
  constructor(model: ModelStatic<User>) {
    super(model);
  }

  async isAuth(id: number): Promise<boolean> {
    try {
      const user = await this.findById(id);
      return !!user;
    } catch {
      return false;
    }
  }

  async getUserInfo(id: number): Promise<Partial<User> | null> {
    const user = await this.findById(id);
    if (!user) return null;

    const { password_hash, ...info } = user.get();
    return info;
  }

  async getUserStats(id: number): Promise<UserStats> {
    return this.transaction(async (t) => {
      const user = (await this.model.findByPk(id, {
        include: [
          { association: "wallets" },
          { association: "transactions" },
          { association: "debts" },
          { association: "creditAgreements" },
        ],
        transaction: t,
      })) as UserWithAssociations | null;

      if (!user) {
        return {
          totalTransactions: 0,
          totalWallets: 0,
          totalDebts: 0,
          totalCreditAgreements: 0,
          lastActive: null,
        };
      }

      const userData = user.get();

      return {
        totalTransactions: userData.transactions?.length || 0,
        totalWallets: userData.wallets?.length || 0,
        totalDebts: userData.debts?.length || 0,
        totalCreditAgreements: userData.creditAgreements?.length || 0,
        lastActive: userData.lastLoginAt || null,
      };
    });
  }

  async findByEmail(
    email: string,
    options?: TransactionOptions,
  ): Promise<User | null> {
    return this.findOne({ where: { email } }, options);
  }

  async findByEmailWithPassword(
    email: string,
    options?: TransactionOptions,
  ): Promise<User | null> {
    try {
      const user = await this.model.findOne({
        where: { email },
        attributes: { include: ["password_hash"] },
        transaction: options?.transaction,
      });
      return user;
    } catch (error) {
      throw new Error(`Error finding user by email: ${error}`);
    }
  }

  async createUser(
    userData: {
      email: string;
      password: string;
      name: string;
      default_currency?: string;
    },
    options?: TransactionOptions,
  ): Promise<Omit<User, "password_hash">> {
    const hashedPassword = await hash(userData.password, 10);

    const user = await this.create(
      {
        email: userData.email,
        password_hash: hashedPassword,
        name: userData.name,
        default_currency: userData.default_currency || "RUB",
      } as any,
      options,
    );

    const { password_hash, ...userWithoutPassword } = user.get();
    return userWithoutPassword as Omit<User, "password_hash">;
  }

  async authenticate(
    email: string,
    password: string,
    options?: TransactionOptions,
  ): Promise<Omit<User, "password_hash"> | null> {
    const user = await this.findByEmailWithPassword(email, options);

    if (!user) return null;

    const isValid = await compare(password, user.password_hash);
    if (!isValid) return null;

    const { password_hash, ...userWithoutPassword } = user.get();
    return userWithoutPassword as Omit<User, "password_hash">;
  }

  async updateLastLogin(
    id: number,
    options?: TransactionOptions,
  ): Promise<void> {
    await this.update(id, { lastLoginAt: new Date() }, options);
  }

  async findActiveUsers(options?: TransactionOptions): Promise<User[]> {
    return this.findAll(
      {
        where: { isActive: true } as any,
      },
      options,
    );
  }
  async findByIdWithPassword(
    id: number,
    options?: TransactionOptions,
  ): Promise<User | null> {
    return this.model.findByPk(id, {
      attributes: { include: ["password_hash"] },
      transaction: options?.transaction,
    });
  }
}
