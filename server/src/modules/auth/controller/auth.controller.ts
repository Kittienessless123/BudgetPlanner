import type { NextFunction, Response, Request } from "express";
require("dotenv").config();
import { AuthService } from "../service/auth.service.ts";

export class AuthController {
  async registration(req: Request, res: Response, next: NextFunction) {
    const { email, password, name } = req.body;
    const authService = new AuthService();
    const result = await authService.registration(email, password, name);
    return result;
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const authService = new AuthService();
    const result = await authService.login(email, password);
    return result;
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;
    const authService = new AuthService();
    const result = await authService.logout(id);
    return result;
  }
  async activate(req: Request, res: Response, next: NextFunction) {}
  
  async refresh(req: Request, res: Response, next: NextFunction) {}
}
