import { type AuthErrorKey, AUTH_ERRORS } from '../constances/auth.constances.ts';

export class AuthError extends Error {
  public readonly code: AuthErrorKey;
  public readonly statusCode: number;

  constructor(code: AuthErrorKey, statusCode: number = 400) {
    super(AUTH_ERRORS[code]);
    this.code = code;
    this.statusCode = statusCode;
    this.name = 'AuthError';
  }
}