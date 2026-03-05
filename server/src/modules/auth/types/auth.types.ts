import type { UserStats } from "../../../../database/repositories/users.repository.ts";

// types/user.types.ts
export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  default_currency?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  default_currency: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithStats extends UserResponse {
  stats: UserStats;
}