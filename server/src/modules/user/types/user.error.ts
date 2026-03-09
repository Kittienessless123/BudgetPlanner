export type UserErrorKey = 
  | 'USER_NOT_FOUND'
  | 'USER_ALREADY_EXISTS'
  | 'UNAUTHORIZED'
  | 'TOKEN_INVALID'
  | 'PASSWORD_MISMATCH'
  | 'CANNOT_DELETE_WITH_ACTIVE_DEBTS'
  | 'CANNOT_DELETE_WITH_POSITIVE_BALANCE';

export const USER_ERRORS: Record<UserErrorKey, string> = {
  USER_NOT_FOUND: 'Пользователь не найден',
  USER_ALREADY_EXISTS: 'Пользователь с таким email уже существует',
  UNAUTHORIZED: 'Не авторизован',
  TOKEN_INVALID: 'Недействительный токен',
  PASSWORD_MISMATCH: 'Неверный пароль',
  CANNOT_DELETE_WITH_ACTIVE_DEBTS: 'Невозможно удалить аккаунт с активными долгами',
  CANNOT_DELETE_WITH_POSITIVE_BALANCE: 'Невозможно удалить аккаунт с положительным балансом'
};

export class UserError extends Error {
  public readonly code: UserErrorKey;
  public readonly statusCode: number;

  constructor(code: UserErrorKey, statusCode: number = 400) {
    super(USER_ERRORS[code]);
    this.code = code;
    this.statusCode = statusCode;
    this.name = 'UserError';
  }
}