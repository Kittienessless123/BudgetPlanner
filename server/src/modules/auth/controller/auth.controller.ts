import type { NextFunction, Response, Request } from "express";
require("dotenv").config();

export class AuthController {
  async registration(req: Request, res: Response, next: NextFunction) {}

  async activate(req: Request, res: Response, next: NextFunction) {}

  async login(req: Request, res: Response, next: NextFunction) {}

  async refresh(req: Request, res: Response, next: NextFunction) {}

  async logout(req: Request, res: Response, next: NextFunction) {}
}
