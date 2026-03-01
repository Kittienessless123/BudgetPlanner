// types/repository.types.ts
export interface IRepository<T> {
  findById(id: string | number): Promise<T | null>;
  findAll(filter?: Partial<T>): Promise<T[]>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string | number, data: Partial<T>): Promise<T | null>;
  delete(id: string | number): Promise<boolean>;
  count(filter?: Partial<T>): Promise<number>;
}