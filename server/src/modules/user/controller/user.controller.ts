import type { NextFunction, Response, Request } from "express";
require("dotenv").config();

export class UserController {
  async getUserDataByPk(req: Request, res: Response, next: NextFunction) {}

  async getUserWallets(req: Request, res: Response, next: NextFunction) {}

  async getUserDebts(req: Request, res: Response, next: NextFunction) {}

  async userStats(req: Request, res: Response, next: NextFunction) {}

}
