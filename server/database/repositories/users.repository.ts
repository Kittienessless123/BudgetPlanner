// repositories/user.repository.ts
import { BaseRepository } from ".//base.repository.ts";
import { InjectModel } from "../decorators/inject-model.decorator.ts";
import { User, UserAttributes } from "../models/user.model.ts";
import { ModelCtor } from "sequelize";
import type { RegisterRequestDto } from "../../src/modules/auth/dto/register.dto.ts";
const bcrypt = require("bcrypt");

// Дополнительные методы специфичные для пользователя
export interface IUserRepository extends IRepository<RegisterRequestDto> {
  findByEmail(email: string): Promise<User | null>;
  findActiveUsers(): Promise<User[]>;
  updateLastLogin(userId: number): Promise<void>;
}

export class UserRepository
  extends BaseRepository<RegisterRequestDto>
  implements IUserRepository
{
  constructor(
    @InjectModel("User") protected model: ModelCtor<RegisterRequestDto>,
  ) {
    super(model);
  }

  // Специфичные методы
  async findByEmailPassword(
    email: string,
    password: string,
  ): Promise<RegisterRequestDto | null> {
    try {
      const user = await this.model.findOne({
        where: { email },
      });
      const isPassEquals = await bcrypt.compare(password, user.password);
      if (!isPassEquals) throw new Error("Пароль неверный");
    } catch (error) {
      throw new Error(`Error finding user by email: ${error}`);
    }
  }

  async findActiveUsers(): Promise<User[]> {
    try {
      return await this.model.findAll({
        where: {
          isActive: true,
          deletedAt: null,
        },
      });
    } catch (error) {
      throw new Error(`Error finding active users: ${error}`);
    }
  }

  async updateLastLogin(userId: number): Promise<void> {
    try {
      await this.model.update(
        { lastLoginAt: new Date() },
        { where: { id: userId } },
      );
    } catch (error) {
      throw new Error(`Error updating last login: ${error}`);
    }
  }

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

  async isAuth(id: number) {
    return true;
  }
  async getUserInfo(id: number) {}
  async getUserStats(id: number) {}
}
