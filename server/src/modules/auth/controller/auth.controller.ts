import type { NextFunction, Response, Request } from "express";
import "dotenv/config";
import { AuthService } from "../service/auth.service.ts";
import { Container } from "../../../../database/di/container.ts";
import { RegisterDto } from "../dto/register.dto.ts";
import { LoginDto, UpdateNameDto, ResetPasswordDto } from "../dto/login.dto.ts";

export class AuthController {
  private authService = Container.get<AuthService>("AuthService");
  private readonly COOKIE_NAME = "token";

  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new RegisterDto(
        req.body.email,
        req.body.password,
        req.body.name,
        req.body.default_currency,
      );
      const result = await this.authService.registration(dto);
      this.setTokenCookie(res, result.refreshToken);
      return res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new LoginDto(req.body.email, req.body.password);
      const result = await this.authService.login(dto);
      this.setTokenCookie(res, result.refreshToken);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const result = await this.authService.logout(refreshToken);
      res.clearCookie(this.COOKIE_NAME);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const oldRefreshToken = req.cookies[this.COOKIE_NAME];
      const result = await this.authService.refresh(oldRefreshToken);
      this.setTokenCookie(res, result.refreshToken);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const dto = new ResetPasswordDto(
        userId,
        req.body.oldPassword,
        req.body.newPassword,
      );
      const result = await this.authService.resetPassword(dto);
      res.clearCookie(this.COOKIE_NAME);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  private setTokenCookie(res: Response, refreshToken: string) {
    res.cookie(this.COOKIE_NAME, refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }
}
