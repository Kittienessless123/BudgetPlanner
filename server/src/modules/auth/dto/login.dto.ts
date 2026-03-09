export class LoginDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}

export class UpdateNameDto {
  constructor(
    public readonly userId: number,
    public readonly newName: string
  ) {}
}

export class ResetPasswordDto {
  constructor(
    public readonly userId: number,
    public readonly oldPassword: string,
    public readonly newPassword: string
  ) {}
}