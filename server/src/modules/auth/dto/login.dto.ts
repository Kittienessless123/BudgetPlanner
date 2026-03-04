import type { User } from "../types/auth.types.ts";

export  class LoginRequestDto {
  email: string;
  password: string;
  constructor(email : string, password : string, ) {
    this.email = email;
    this.password = password;
  }
};

module.exports = class LoginResponseDto {
  id: number;
  constructor(model: User) {
    this.id = model.id;
  }
};
