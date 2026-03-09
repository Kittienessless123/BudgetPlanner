export class UserDto {
  public readonly id: number;
  public readonly email: string;
  public readonly name: string;
  public readonly default_currency: string;
  public readonly isActive: boolean;
  public readonly lastLoginAt: Date | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.default_currency = user.default_currency || "RUB";
    this.isActive = user.isActive ?? true;
    this.lastLoginAt = user.lastLoginAt || null;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
export class UpdateUserDto {
  constructor(
    public readonly userId: number,
    public readonly name?: string,
    public readonly email?: string,
    public readonly default_currency?: string,
  ) {}
}

export class DeleteAccountDto {
  constructor(
    public readonly userId: number,
    public readonly password: string,
  ) {}
}
