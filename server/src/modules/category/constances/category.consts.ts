export type CategoryErrorKey = 
  | 'CATEGORY_NOT_FOUND'
  | 'CATEGORY_ALREADY_EXISTS'
  | 'UNAUTHORIZED'
  | 'TOKEN_INVALID'
  | 'CANNOT_DELETE_SYSTEM_CATEGORY'
  | 'CANNOT_UPDATE_SYSTEM_CATEGORY'
  | 'PARENT_CATEGORY_NOT_FOUND';

export const CATEGORY_ERRORS: Record<CategoryErrorKey, string> = {
  CATEGORY_NOT_FOUND: 'Категория не найдена',
  CATEGORY_ALREADY_EXISTS: 'Категория с таким именем уже существует',
  UNAUTHORIZED: 'Не авторизован',
  TOKEN_INVALID: 'Недействительный токен',
  CANNOT_DELETE_SYSTEM_CATEGORY: 'Нельзя удалить системную категорию',
  CANNOT_UPDATE_SYSTEM_CATEGORY: 'Нельзя изменить системную категорию',
  PARENT_CATEGORY_NOT_FOUND: 'Родительская категория не найдена'
};

export class CategoryError extends Error {
  public readonly code: CategoryErrorKey;
  public readonly statusCode: number;

  constructor(code: CategoryErrorKey, statusCode: number = 400) {
    super(CATEGORY_ERRORS[code]);
    this.code = code;
    this.statusCode = statusCode;
    this.name = 'CategoryError';
  }
}