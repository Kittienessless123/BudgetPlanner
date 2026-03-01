// auth/auth.constants.ts
import { type IModuleMessages } from '../../../shared/types/messages.types.ts';

// Литеральные типы для ключей
export type AuthErrorKey = 
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'USER_ALREADY_EXISTS'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'TOKEN_MISSING'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'PASSWORD_TOO_WEAK'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_LOCKED'
  | 'INVALID_RESET_TOKEN'
  | 'RESET_TOKEN_EXPIRED'
  | 'OLD_PASSWORD_MISMATCH'
  | 'REFRESH_TOKEN_INVALID'
  | 'SESSION_EXPIRED'
  | 'MAX_LOGIN_ATTEMPTS'
  | 'INVALID_2FA_CODE'
  | '2FA_REQUIRED'
  | 'OAUTH_PROVIDER_ERROR';

export type AuthSuccessKey =
  | 'LOGIN_SUCCESS'
  | 'LOGOUT_SUCCESS'
  | 'REGISTER_SUCCESS'
  | 'EMAIL_VERIFIED'
  | 'PASSWORD_RESET_SENT'
  | 'PASSWORD_CHANGED'
  | 'TOKEN_REFRESHED'
  | 'ACCOUNT_CREATED'
  | 'VERIFICATION_EMAIL_SENT'
  | '2FA_ENABLED'
  | '2FA_DISABLED'
  | 'OAUTH_SUCCESS';

export const AUTH_MESSAGES: IModuleMessages<AuthErrorKey, AuthSuccessKey> = {
  errors: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXISTS: 'User with this email already exists',
    TOKEN_EXPIRED: 'Token has expired',
    TOKEN_INVALID: 'Invalid token',
    TOKEN_MISSING: 'Access token missing',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'You do not have permission to perform this action',
    PASSWORD_TOO_WEAK: 'Password does not meet security requirements',
    EMAIL_NOT_VERIFIED: 'Please verify your email first',
    ACCOUNT_LOCKED: 'Account has been locked due to too many failed attempts',
    INVALID_RESET_TOKEN: 'Invalid password reset token',
    RESET_TOKEN_EXPIRED: 'Password reset token has expired',
    OLD_PASSWORD_MISMATCH: 'Current password is incorrect',
    REFRESH_TOKEN_INVALID: 'Invalid refresh token',
    SESSION_EXPIRED: 'Your session has expired, please login again',
    MAX_LOGIN_ATTEMPTS: 'Maximum login attempts reached. Try again later',
    INVALID_2FA_CODE: 'Invalid two-factor authentication code',
    '2FA_REQUIRED': 'Two-factor authentication is required',
    OAUTH_PROVIDER_ERROR: 'OAuth provider returned an error',
  },
  success: {
    LOGIN_SUCCESS: 'Successfully logged in',
    LOGOUT_SUCCESS: 'Successfully logged out',
    REGISTER_SUCCESS: 'Account created successfully',
    EMAIL_VERIFIED: 'Email successfully verified',
    PASSWORD_RESET_SENT: 'Password reset instructions sent to your email',
    PASSWORD_CHANGED: 'Password changed successfully',
    TOKEN_REFRESHED: 'Access token refreshed successfully',
    ACCOUNT_CREATED: 'Account created successfully',
    VERIFICATION_EMAIL_SENT: 'Verification email sent',
    '2FA_ENABLED': 'Two-factor authentication enabled successfully',
    '2FA_DISABLED': 'Two-factor authentication disabled successfully',
    OAUTH_SUCCESS: 'Successfully authenticated via OAuth',
  },
};

// Отдельные объекты для удобства
export const AUTH_ERRORS = AUTH_MESSAGES.errors;
export const AUTH_SUCCESS = AUTH_MESSAGES.success;