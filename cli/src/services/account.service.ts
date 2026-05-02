import { AccountApi } from "../api/account.api";
import { TokenService } from "../services/token-storage.service";
import { UserDto } from "../dto";
import { Validator } from "../utils/validator";

export class AccountService {
  private name: string = "";
  private email: string = "";
  private password: string = "";
  private validator: Validator;
  private api: AccountApi;
  private token: TokenService;

  constructor(name: string, password: string, email: string) {
    this.validator = new Validator();
    this.api = new AccountApi();
    this.token = new TokenService();
    this.setEmail(email);
    this.setName(name);
    this.setPassword(password);
  }

  getToken(value: string) {
    return this.token.get(value);
  }

  setName(value: string) {
    const nameToValidate = this.validator.validateName(value);
    if (!nameToValidate.isValid) {
      throw new Error(nameToValidate.errors.join(", "));
    }
    this.name = value;
  }

  setEmail(value: string) {
    const emailToValidate = this.validator.validateEmail(value);
    if (!emailToValidate.isValid) {
      throw new Error(emailToValidate.errors.join(", "));
    }
    this.email = value;
  }

  setPassword(value: string) {
    const passwordToValidate = this.validator.validatePassword(value);
    if (!passwordToValidate.isValid) {
      throw new Error(passwordToValidate.errors.join(", "));
    }
    this.password = value;
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  get = async (
    token: string,
  ): Promise<{ data: UserDto; result: string; errors: string[] }> => {
    try {
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await this.api.get<UserDto>(token);
      if (response.status !== 200) {
        throw new Error(response.message || "Failed to get user");
      }

      return {
        data: response.data,
        result: "success",
        errors: [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      return {
        data: {} as UserDto,
        result: "error",
        errors: [errorMessage],
      };
    }
  };

  put = async (
    token: string,
    dto: Partial<UserDto>,
  ): Promise<{ data: UserDto; result: string; errors: string[] }> => {
    try {
      if (!token) {
        throw new Error("Token is required");
      }

      if (Object.keys(dto).length === 0) {
        throw new Error("No data to update");
      }
      const response = await this.api.put<UserDto>(token, dto);
      if (response.status !== 200) {
        throw new Error(response.message || "Failed to update user");
      }

      return {
        data: response.data,
        result: "success",
        errors: [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      return {
        data: {} as UserDto,
        result: "error",
        errors: [errorMessage],
      };
    }
  };

  delete = async (
    token: string,
  ): Promise<{ data: UserDto; result: string; errors: string[] }> => {
    try {
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await this.api.delete<UserDto>(token);
      if (response.status !== 200) {
        throw new Error(response.message || "Failed to delete user");
      }

      return {
        data: response.data,
        result: "success",
        errors: [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      return {
        data: {} as UserDto,
        result: "error",
        errors: [errorMessage],
      };
    }
  };

  changePassword = async (
    token: string,
    password: string,
  ): Promise<{ data: UserDto; result: string; errors: string[] }> => {
    try {
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await this.api.changePassword<UserDto>({
        token,
        password,
      });
      if (response.status !== 200) {
        throw new Error(response.message || "Failed to delete user");
      }

      return {
        data: response.data,
        result: "success",
        errors: [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      return {
        data: {} as UserDto,
        result: "error",
        errors: [errorMessage],
      };
    }
  };
}
