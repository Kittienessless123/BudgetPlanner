export class UserBankDto {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly bankId: number,
    public readonly bankName: string,
    public readonly bankCode: string,
    public readonly bankCurrency: string,
    public readonly accountNumber: string,
    public readonly accountName: string | null,
    public readonly isPrimary: boolean,
    public readonly lastSyncAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static fromModel(userBank: any): UserBankDto {
    return new UserBankDto(
      userBank.id,
      userBank.user_id,
      userBank.bank_id,
      userBank.bank?.name || 'Unknown',
      userBank.bank?.code || '',
      userBank.bank?.currency || 'RUB',
      userBank.account_number,
      userBank.account_name || null,
      userBank.is_primary,
      userBank.last_sync_at || null,
      userBank.createdAt,
      userBank.updatedAt
    );
  }
}

export class CreateUserBankDto {
  constructor(
    public readonly userId: number,
    public readonly bankId: number,
    public readonly accountNumber: string,
    public readonly accountName?: string,
    public readonly isPrimary?: boolean
  ) {}
}
export class UpdateUserBankDto {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly accountNumber?: string,
    public readonly accountName?: string | null,
    public readonly isPrimary?: boolean
  ) {}
}