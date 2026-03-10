export type UserBankErrorKey =
  | 'UNAUTHORIZED'
  | 'TOKEN_INVALID'
  | 'BANK_NOT_FOUND'
  | 'USER_BANK_NOT_FOUND'
  | 'BANK_ALREADY_ADDED';

export const USER_BANK_ERRORS: Record<UserBankErrorKey, string> = {
  UNAUTHORIZED: 'Не авторизован',
  TOKEN_INVALID: 'Недействительный токен',
  BANK_NOT_FOUND: 'Банк не найден в справочнике',
  USER_BANK_NOT_FOUND: 'Банк пользователя не найден',
  BANK_ALREADY_ADDED: 'Этот банк уже добавлен',
};

export class UserBankError extends Error {
  public readonly code: UserBankErrorKey;
  public readonly statusCode: number;

  constructor(code: UserBankErrorKey, statusCode: number = 400) {
    super(USER_BANK_ERRORS[code]);
    this.code = code;
    this.statusCode = statusCode;
    this.name = 'UserBankError';
  }
}