import { type IModuleMessages } from '../../../shared/types/messages.types.ts';

export type UserErrorKey =
  | 'USER_NOT_FOUND'
  | 'PROFILE_NOT_FOUND'
  | 'INVALID_USER_DATA'
  | 'EMAIL_ALREADY_EXISTS'
  | 'USERNAME_ALREADY_TAKEN'
  | 'CANNOT_DELETE_OWN_ACCOUNT'
  | 'CANNOT_DELETE_ADMIN'
  | 'USER_INACTIVE'
  | 'PROFILE_IMAGE_TOO_LARGE'
  | 'INVALID_IMAGE_FORMAT'
  | 'BIO_TOO_LONG'
  | 'INVALID_PHONE_FORMAT'
  | 'INVALID_DATE_OF_BIRTH'
  | 'USER_ALREADY_VERIFIED'
  | 'VERIFICATION_NOT_FOUND';

export type UserSuccessKey =
  | 'PROFILE_UPDATED'
  | 'PROFILE_CREATED'
  | 'USER_DELETED'
  | 'USER_VERIFIED'
  | 'SETTINGS_UPDATED'
  | 'AVATAR_UPLOADED'
  | 'AVATAR_REMOVED'
  | 'PREFERENCES_SAVED'
  | 'PROFILE_VISIBILITY_UPDATED';

export const USER_MESSAGES: IModuleMessages<UserErrorKey, UserSuccessKey> = {
  errors: {
    USER_NOT_FOUND: 'User not found',
    PROFILE_NOT_FOUND: 'User profile not found',
    INVALID_USER_DATA: 'Invalid user data provided',
    EMAIL_ALREADY_EXISTS: 'User with this email already exists',
    USERNAME_ALREADY_TAKEN: 'Username is already taken',
    CANNOT_DELETE_OWN_ACCOUNT: 'You cannot delete your own account',
    CANNOT_DELETE_ADMIN: 'Administrator accounts cannot be deleted',
    USER_INACTIVE: 'User account is inactive',
    PROFILE_IMAGE_TOO_LARGE: 'Profile image size exceeds maximum allowed (5MB)',
    INVALID_IMAGE_FORMAT: 'Invalid image format. Allowed: JPG, PNG, GIF',
    BIO_TOO_LONG: 'Bio exceeds maximum length of 500 characters',
    INVALID_PHONE_FORMAT: 'Invalid phone number format',
    INVALID_DATE_OF_BIRTH: 'Invalid date of birth',
    USER_ALREADY_VERIFIED: 'User is already verified',
    VERIFICATION_NOT_FOUND: 'Verification record not found',
  },
  success: {
    PROFILE_UPDATED: 'Profile updated successfully',
    PROFILE_CREATED: 'Profile created successfully',
    USER_DELETED: 'User account deleted successfully',
    USER_VERIFIED: 'User verified successfully',
    SETTINGS_UPDATED: 'User settings updated successfully',
    AVATAR_UPLOADED: 'Avatar uploaded successfully',
    AVATAR_REMOVED: 'Avatar removed successfully',
    PREFERENCES_SAVED: 'User preferences saved successfully',
    PROFILE_VISIBILITY_UPDATED: 'Profile visibility updated successfully',
  },
};

export const USER_ERRORS = USER_MESSAGES.errors;
export const USER_SUCCESS = USER_MESSAGES.success;