import type { NextFunction, Response, Request } from "express";
require("dotenv").config();
import { AuthService } from "../service/auth.service.ts";
import { Container } from "../../../../database/di/container.ts";
import type { TokenService } from "../../token/service/token.service.ts";

export class AuthController { 
  private authService = Container.get<AuthService>('AuthService');
  private tokenService = Container.get<TokenService>('TokenService');

  async registration(req: Request, res: Response, next: NextFunction) {
    const { email, password, name } = req.body;
    const result = await this.authService.registration(email, password, name);
    return result;
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const result = await this.authService.login(email, password);
    return result;
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;
    const result = await this.authService.logout(id);
    return result;
  }
  async activate(req: Request, res: Response, next: NextFunction) {}
  
  async refresh(req: Request, res: Response, next: NextFunction) {}
}
