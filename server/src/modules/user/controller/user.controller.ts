import type { NextFunction, Response, Request } from "express";
import { UserService } from "../service/user.service.ts";
import { Container } from "@di/container.ts";
import { UpdateUserDto,DeleteAccountDto } from "../dto/user.dto.ts";
import "dotenv/config";

export class UserController {
  private userService = Container.get<UserService>("UserService");
  private readonly COOKIE_NAME = "token";

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const dto = new UpdateUserDto(
        (req as any).user.id, 
        req.body.name,
        req.body.email,
        req.body.default_currency,
      );

      const result = await this.userService.updateUser(dto);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const dto = new DeleteAccountDto(
        (req as any).user.id,
        req.body.password,
      );

      const result = await this.userService.deleteAccount(dto);
      res.clearCookie(this.COOKIE_NAME); 
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserDataByPk(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const result = await this.userService.getUserData(refreshToken);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMyWallets(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const result = await this.userService.getUserWallets(refreshToken);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMyDebts(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const result = await this.userService.getUserDebts(refreshToken);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMyStats(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const result = await this.userService.getUserStats(refreshToken);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
