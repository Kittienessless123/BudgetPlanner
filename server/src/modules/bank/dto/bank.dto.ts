export class BankDto {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly code: string,
    public readonly currency: string,
  ) {}

  static fromModel(bank: any): BankDto {
    return new BankDto(
      bank.id,
      bank.name || "Unknown",
      bank.code || "",
      bank.currency || "RUB",
    );
  }
}
