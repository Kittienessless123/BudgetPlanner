import type { NextFunction, Response, Request } from "express";
require("dotenv").config();
import { AuthService } from "../service/auth.service.ts";
import { Container } from "../../../../database/di/container.ts";
import type { TokenService } from "../../token/service/token.service.ts";

export class AuthController {
  private authService = Container.get<AuthService>("AuthService");
  private tokenService = Container.get<TokenService>("TokenService");
  COOKIE_NAME = "token";

  async registration(req: Request, res: Response, next: NextFunction) {
    const { email, password, name } = req.body;
    const result = await this.authService.registration(email, password, name);
    return res.json(result);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const result = await this.authService.login(email, password);
    return res.json(result);
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;
    const result = await this.authService.logout(id);
    return res.json(result);
  }
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies["token"];
      const userData = await this.authService.refresh(token);
      res.cookie(this.COOKIE_NAME, userData.refreshToken, {
        maxAge: 38 * 24 * 60 * 1000,
        httpOnly: true,
        secure: false,
      });

      return res.json(userData);
    } catch (e) {
      next(e);
      console.log("refresh error" + e);
    }
  }
}
