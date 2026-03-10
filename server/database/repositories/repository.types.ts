import { Model, Transaction } from "@sequelize/core";

export interface TransactionOptions {
  transaction?: Transaction;
}

export interface FindOptions<T extends Model> {
  where?: Partial<T["_attributes"]>;
  limit?: number;
  offset?: number;
  order?: any[];
}

export type CreateData<T extends Model> = Omit<
  T["_attributes"],
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateData<T extends Model> = Partial<CreateData<T>>;

export interface IRepository<T extends Model> {
  findById(
    id: string | number,
    options?: TransactionOptions,
  ): Promise<T | null>;
  findOne(
    options: FindOptions<T>,
    txOptions?: TransactionOptions,
  ): Promise<T | null>;
  findAll(
    options?: FindOptions<T>,
    txOptions?: TransactionOptions,
  ): Promise<T[]>;
  create(data: CreateData<T>, txOptions?: TransactionOptions): Promise<T>;
  update(
    id: string | number,
    data: UpdateData<T>,
    txOptions?: TransactionOptions,
  ): Promise<T | null>;
  delete(id: string | number, txOptions?: TransactionOptions): Promise<boolean>;
  count(
    where?: Partial<T["_attributes"]>,
    txOptions?: TransactionOptions,
  ): Promise<number>;
  transaction<R>(callback: (t: Transaction) => Promise<R>): Promise<R>;
}

export class RepositoryError extends Error {
  public readonly timestamp: Date;
  public readonly code: string;

  constructor(
    message: string,
    public readonly originalError?: unknown,
    public readonly operation?: string,
    public readonly entity?: string,
    public readonly payload?: unknown,
  ) {
    super(message);
    this.name = "RepositoryError";
    this.timestamp = new Date();
    this.code = `REPO_${operation?.toUpperCase() || "ERROR"}`;
    Object.setPrototypeOf(this, RepositoryError.prototype);
  }
}
