import type { User } from "../types/auth.types.ts";

module.exports = class LoginDto {
  id: number;
  email: string;
  password: string;
  constructor(model: User) {
    this.id = model.id;
    this.email = model.email;
    this.password = model.password;
  }
};
