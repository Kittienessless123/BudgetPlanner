import type { User } from "../types/user.types.ts";

module.exports = class UserDto {
  id: number;
  constructor(model: User) {
    this.id = model.id;
  }
};

module.exports = class UserResponseDto {
  id: number;
  constructor(model: User) {
    this.id = model.id;
  }
};


module.exports = class UserRequestDto {
  id: number;
  constructor(model: User) {
    this.id = model.id;
  }
};
