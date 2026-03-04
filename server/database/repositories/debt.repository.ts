// repositories/user.repository.ts
import { BaseRepository } from ".//base.repository.ts";
import { InjectModel } from "../decorators/inject-model.decorator.ts";
import { User, UserAttributes } from "../models/user.model.ts";
import { ModelCtor } from "sequelize";
import type { RegisterRequestDto } from "../../src/modules/auth/dto/register.dto.ts";
const bcrypt = require("bcrypt");

// Дополнительные методы специфичные для пользователя
export interface IDebtRepository extends IRepository<RegisterRequestDto> {
  findByEmail(email: string): Promise<User | null>;
  findActiveUsers(): Promise<User[]>;
  updateLastLogin(userId: number): Promise<void>;
}

export class DebtRepository
  extends BaseRepository<RegisterRequestDto>
  implements IDebtRepository
{
  constructor(
    @InjectModel("User") protected model: ModelCtor<RegisterRequestDto>,
  ) {
    super(model);
  }
  findByEmail(email: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  findActiveUsers(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  updateLastLogin(userId: number): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async create() {}



  async getUserInfo(id: number) {}
}
