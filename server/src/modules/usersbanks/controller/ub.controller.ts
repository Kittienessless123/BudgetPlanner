import type { NextFunction, Response, Request } from "express";
import { UserBankService } from "../service/ub.service.ts";
import { Container } from "@di/container.ts";
import { CreateUserBankDto , UpdateUserBankDto} from "../dto/user-bank.dto.ts";

export class UserBankController {
  private userBankService = Container.get<UserBankService>("UserBankService");
  private readonly COOKIE_NAME = "token";

  async getUserBanks(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const result = await this.userBankService.getUserBanks(refreshToken);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async addUserBank(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const dto = new CreateUserBankDto(
        (req as any).user.id,
        req.body.bankId,
        req.body.accountNumber,
        req.body.accountName,
        req.body.isPrimary
      );
      const result = await this.userBankService.addUserBank(refreshToken, dto);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateUserBank(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const dto = new UpdateUserBankDto(
        Number(req.params.id),
        (req as any).user.id,
        req.body.accountNumber,
        req.body.accountName,
        req.body.isPrimary
      );
      const result = await this.userBankService.updateUserBank(refreshToken, dto);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async removeUserBank(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const userBankId = Number(req.params.id);
      const result = await this.userBankService.removeUserBank(refreshToken, userBankId);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPrimaryBank(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const result = await this.userBankService.getPrimaryBank(refreshToken);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async setPrimaryBank(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const userBankId = Number(req.params.id);
      const result = await this.userBankService.setPrimaryBank(refreshToken, userBankId);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}