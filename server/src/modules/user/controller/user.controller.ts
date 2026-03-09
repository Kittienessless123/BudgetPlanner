import type { NextFunction, Response, Request } from "express";
import { UserService } from "../service/user.service.ts";
import { Container } from "@di/container.ts";
require("dotenv").config();

export class UserController {
  private userService = Container.get<UserService>("AuthService");
  async updateUser() {}
  async deleteAccount() {}

  async getUserDataByPk(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;
    const result = await this.userService.getUserDataByPk(id);
    return result;
  }

  async getMyWallets(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;
    const result = await this.userService.getUserWallets(id);
    return result;
  }

  async getMyDebts(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;
    const result = await this.userService.getUserDebts(id);
    return result;
  }

  async getMyStats(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;
    const result = await this.userService.getUserStats(id);
    return result;
  }
}
