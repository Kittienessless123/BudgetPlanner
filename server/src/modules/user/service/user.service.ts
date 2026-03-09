import type { NextFunction, Response, Request } from "express";
import { UserDto, UpdateUserDto, DeleteAccountDto } from "../dto/user.dto.ts";
import { UserRepository } from "@repositories/users.repository.ts";
import { WalletRepository } from "@repositories/wallet.repository.ts";
import { DebtsRepository } from "@repositories/debt.repository.ts";
import type { TokenService } from "@modules/token/service/token.service.ts";
import { UserError } from "../types/user.error.ts";
import bcrypt from "bcrypt";

export class UserService {
  constructor(
    private tokenService: TokenService,
    private userRepository: UserRepository,
    private walletRepository: WalletRepository,
    private debtsRepository: DebtsRepository,
  ) {}

  private async getUserIdFromToken(refreshToken: string): Promise<number> {
    if (!refreshToken) {
      throw new UserError("UNAUTHORIZED", 401);
    }

    const payload = this.tokenService.validateRefreshToken(refreshToken);
    if (!payload) {
      throw new UserError("TOKEN_INVALID", 401);
    }

    return payload.id;
  }

  async getUserData(refreshToken: string) {
    const userId = await this.getUserIdFromToken(refreshToken);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserError("USER_NOT_FOUND", 404);
    }

    const userDto = new UserDto(user);
    return userDto;
  }

  async getUserWallets(refreshToken: string) {
    const userId = await this.getUserIdFromToken(refreshToken);

    const wallets = await this.walletRepository.findByUserId(userId);
    return wallets;
  }

  async getUserDebts(refreshToken: string) {
    const userId = await this.getUserIdFromToken(refreshToken);

    const debts = await this.debtsRepository.findByUserId(userId);
    return debts;
  }

  async getUserStats(refreshToken: string) {
    const userId = await this.getUserIdFromToken(refreshToken);

    const stats = await this.userRepository.getUserStats(userId);
    return stats;
  }

  async updateUser(dto: UpdateUserDto) {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new UserError("USER_NOT_FOUND", 404);
    }

    const updateData: Partial<{
      name: string;
      email: string;
      default_currency: string;
    }> = {};

    if (dto.name) updateData.name = dto.name;
    if (dto.email) {
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser && existingUser.id !== dto.userId) {
        throw new UserError("USER_ALREADY_EXISTS", 409);
      }
      updateData.email = dto.email;
    }
    if (dto.default_currency)
      updateData.default_currency = dto.default_currency;

    const updatedUser = await this.userRepository.update(
      dto.userId,
      updateData,
    );
    if (!updatedUser) {
      throw new UserError("USER_NOT_FOUND", 404);
    }

    const userDto = new UserDto(updatedUser);
    return {
      message: "User's data updated",
      user: userDto,
    };
  }

  async deleteAccount(dto: DeleteAccountDto) {
    const user = await this.userRepository.findByIdWithPassword(dto.userId);
    if (!user) {
      throw new UserError("USER_NOT_FOUND", 404);
    }

    const isValidPassword = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );
    if (!isValidPassword) {
      throw new UserError("PASSWORD_MISMATCH", 400);
    }

    await this.tokenService.removeAllUserTokens(dto.userId);

    const deleted = await this.userRepository.delete(dto.userId);
    if (!deleted) {
      throw new UserError("USER_NOT_FOUND", 404);
    }

    return {
      message: "Account successfully deleted",
    };
  }
}
