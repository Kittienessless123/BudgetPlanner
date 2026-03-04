import type { User } from "../types/user.types.ts";

export class UserDto {
  id: number;
  constructor(id : number) {
    this.id = id;
  }
}
