// repositories/token.repository.ts
import { BaseRepository } from "./base.repository.ts";
import { Token } from "@models/token.model.ts";
import { type ModelStatic, Transaction, Op } from "@sequelize/core";
import { type TransactionOptions } from "./repository.types.ts";

export interface CreateTokenDTO {
  user_id: number;
  refresh_token: string;
  expires_at?: Date;
  ip_address?: string | null;
  user_agent?: string | null;
}

export class TokenRepository extends BaseRepository<Token> {
  constructor(model: ModelStatic<Token>) {
    super(model);
  }

  async findByToken(
    refreshToken: string,
    options?: TransactionOptions,
  ): Promise<Token | null> {
    return this.findOne(
      {
        where: { refresh_token: refreshToken },
      },
      options,
    );
  }

  async findByTokenWithUser(
    refreshToken: string,
    options?: TransactionOptions,
  ): Promise<Token | null> {
    return this.model.findOne({
      where: { refresh_token: refreshToken },
      include: [{ association: "user" }],
      transaction: options?.transaction,
    });
  }

  async findByUserId(
    userId: number,
    options?: TransactionOptions,
  ): Promise<Token[]> {
    return this.findAll(
      {
        where: { user_id: userId },
        order: [["createdAt", "DESC"]],
      },
      options,
    );
  }

  async saveToken(
    data: CreateTokenDTO,
    options?: TransactionOptions,
  ): Promise<Token> {
    const existingToken = await this.findOne(
      {
        where: {
          user_id: data.user_id,
          refresh_token: data.refresh_token,
        },
      },
      options,
    );

    if (existingToken) {
      return this.update(
        existingToken.id,
        {
          refresh_token: data.refresh_token,
          expires_at: data.expires_at,
        },
        options,
      ) as Promise<Token>;
    }

    return this.create(
      {
        user_id: data.user_id,
        refresh_token: data.refresh_token,
        expires_at:
          data.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ip_address: data.ip_address,
        user_agent: data.user_agent,
      } as any,
      options,
    );
  }

  async removeToken(
    refreshToken: string,
    options?: TransactionOptions,
  ): Promise<boolean> {
    const deleted = await this.model.destroy({
      where: { refresh_token: refreshToken },
      transaction: options?.transaction,
    });
    return deleted > 0;
  }

  async removeAllUserTokens(
    userId: number,
    options?: TransactionOptions,
  ): Promise<number> {
    return this.model.destroy({
      where: { user_id: userId },
      transaction: options?.transaction,
    });
  }

  async removeExpiredTokens(options?: TransactionOptions): Promise<number> {
    return this.model.destroy({
      where: {
        expires_at: { [Op.lt]: new Date() },
      },
      transaction: options?.transaction,
    });
  }

  async tokenExists(
    refreshToken: string,
    options?: TransactionOptions,
  ): Promise<boolean> {
    const count = await this.count(
      {
        refresh_token: refreshToken,
      } as any,
      options,
    );
    return count > 0;
  }
}
