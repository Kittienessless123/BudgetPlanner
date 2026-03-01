import type { User } from "../types/auth.types.ts";

module.exports = class LoginDto {
  id: number;
  email: string;
  password: string;
  name: string;
    constructor(model: User) {
    this.id = model.id;
    this.email = model.email;
    this.password = model.password;
    this.name = model.name;
  }
};
