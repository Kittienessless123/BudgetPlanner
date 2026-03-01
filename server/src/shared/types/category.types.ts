// types/category.types.ts

export type CategoryType = 'system' | 'user';

export type CategoryParentType = 'purchase' | 'user';

export interface BaseCategory {
  id: number;
  name: string;
  parentId: number | null;
  isActive: boolean;
}

export interface PurchaseCategory extends BaseCategory {
  // системная категория
  type: 'system';
}

export interface UserCategory extends BaseCategory {
  // пользовательская категория
  type: 'user';
  userId: number;
  parentType: CategoryParentType;
}