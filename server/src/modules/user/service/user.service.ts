import type { NextFunction, Response, Request } from "express";
import { UserDto } from "../dto/user.dto.ts";
import { UserRepository } from "@repositories/users.repository.ts";
import { WalletRepository } from "@repositories/wallet.repository.ts";
import { DebtsRepository } from "@repositories/debt.repository.ts";
import type { TokenService } from "@modules/token/service/token.service.ts";
require("dotenv").config();

export class UserService {
  constructor(
    private tokenService: TokenService,
    private userRepository: UserRepository,
  ) {}

  async getUserDataByPk(id: number) {
    const user = new UserDto(id);
    const isAuth = await this.userRepository.isAuth(id);
    if (!isAuth) throw new Error("register failed");
    const result = await this.userRepository.getUserInfo(id);
    return result;
  }

  async getUserWallets(id: number) {
    const user = new UserDto(id);
    const isAuth = await this.userRepository.isAuth(user.id);
    if (!isAuth) throw new Error("register failed");/* 
    const walletRepo = new WalletRepository();
    const info = walletRepo.getWalletByUser(user.id); */
    if (!info) throw new Error("info failed");
    return info;
  }

  async getUserDebts(id: number) {
    const user = new UserDto(id);
    const isAuth = await this.userRepository.isAuth(id);
    if (!isAuth) throw new Error("register failed");/* 
    const debtRepo = new DebtRepository();
    const debt = await debtRepo.getUserInfo(user.id); */
    return debt;
  }

  async getUserStats(id: number) {
    const user = new UserDto(id);
    const isAuth = await this.userRepository.isAuth(id);
    if (!isAuth) throw new Error("register failed");
    const result = await this.userRepository.getUserStats(user.id);
    return result;
  }
}
