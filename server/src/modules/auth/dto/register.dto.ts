import type { User } from "../types/auth.types.ts";

export class RegisterRequestDto {
  email: string;
  password: string;
  name: string;
  constructor(email : string, password : string, name : string) {
    this.email = email;
    this.password = password;
    this.name = name;
  }
};

module.exports = class RegisterResponseDto {
  id: number;
  constructor(model: User) {
    this.id = model.id;
  }
};
