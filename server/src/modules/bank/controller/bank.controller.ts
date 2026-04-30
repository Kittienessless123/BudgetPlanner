import type { NextFunction, Response, Request } from "express";
import { BankService } from "../service/bank.service.ts";
import { Container } from "@di/container.ts";
import { BankDto } from "../dto/bank.dto.ts";

export class BankController {
  private bankService = Container.get<BankService>("BankService");

  async getAllBanks(req: Request, res: Response, next: NextFunction) {
    const banks = await this.bankService.getAll();
    const result = banks.map(BankDto.fromModel);
    return res.json(result);
  }
}
