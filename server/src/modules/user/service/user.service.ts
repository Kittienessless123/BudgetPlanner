import type { NextFunction, Response, Request } from "express";
import { UserDto } from "../dto/user.dto.ts";
import { UserRepository } from "../../../../database/repositories/users.repository.ts";
import { WalletRepository } from "../../../../database/repositories/wallet.repository.ts";
import { DebtRepository } from "../../../../database/repositories/debt.repository.ts";
require("dotenv").config();

export class UserService {
  async getUserDataByPk(id: number) {
    const userRepo = new UserRepository();
    const user = new UserDto(id);
    const isAuth = await userRepo.isAuth(id);
    if (!isAuth) throw new Error("register failed");
    const result = await userRepo.getUserInfo(id);
    return result;
  }

  async getUserWallets(id: number) {
    const userRepo = new UserRepository();
    const user = new UserDto(id);
    const isAuth = await userRepo.isAuth(user.id);
    if (!isAuth) throw new Error("register failed");
    const walletRepo = new WalletRepository();
    const info = walletRepo.getWalletByUser(user.id);
    if (!info) throw new Error("info failed");
    return info;
  }

  async getUserDebts(id: number) {
    const userRepo = new UserRepository();
    const user = new UserDto(id);
    const isAuth = await userRepo.isAuth(id);
    if (!isAuth) throw new Error("register failed");
    const debtRepo = new DebtRepository();
    const debt = await debtRepo.getUserInfo(user.id);
    return debt;
  }

  async getUserStats(id: number) {
    const userRepo = new UserRepository();
    const user = new UserDto(id);
    const isAuth = await userRepo.isAuth(id);
    if (!isAuth) throw new Error("register failed");
    const result = await userRepo.getUserStats(user.id);
    return result;
  }
}
