// repositories/user.repository.ts
import { BaseRepository } from ".//base.repository.ts";
import { InjectModel } from "../decorators/inject-model.decorator.ts";
import { User, UserAttributes } from "../models/user.model.ts";
import { ModelCtor } from "sequelize";
import type { RegisterRequestDto } from "../../src/modules/auth/dto/register.dto.ts";
const bcrypt = require("bcrypt");

// Дополнительные методы специфичные для пользователя
export interface IWalletRepository extends IRepository<RegisterRequestDto> {
  findByEmail(email: string): Promise<User | null>;
  findActiveUsers(): Promise<User[]>;
  updateLastLogin(userId: number): Promise<void>;
}

export class WalletRepository
  extends BaseRepository<Wallet>
  implements IWalletRepository
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

  // Специфичные методы
 

  // Переопределение базовых методов (если нужно)
  async create(
    data: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<User> {
    // Добавляем хеширование пароля перед созданием
    const hashedData = {
      ...data,
      password: await this.hashPassword(data.password),
    };
    return super.create(hashedData);
  }

  private async hashPassword(password: string): Promise<string> {
    // логика хеширования
    return password; // заглушка
  }

  async getWalletByUser(id : number) {
    
  }
}
