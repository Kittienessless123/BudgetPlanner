import type { BankRepository } from "@repositories/bank.repository.ts";
import type { NextFunction, Response, Request } from "express";
require("dotenv").config();

export class BankService {
  constructor(private bankRepository: BankRepository) {}

  async getAll() {
    const result = await this.bankRepository.findAll();
    return result;
  }
}
