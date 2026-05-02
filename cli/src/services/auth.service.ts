import { AuthApi } from "../api/auth.api.ts";
import { storageService } from "../core-modules/storage/index.ts";
import { UserDto, AuthResponseDto } from "../dto";
import { Validator } from "../utils/validator/index.ts";
import { cliLogger } from "../utils/logger.util.ts";

export class AuthService {
  private validator: Validator;
  private api: AuthApi;

  constructor() {
    this.validator = new Validator();
    this.api = new AuthApi();
  }

  /**
   * Вход пользователя
   */
  login = async (
    email: string,
    password: string,
  ): Promise<{ data: AuthResponseDto; result: string; errors: string[] }> => {
    try {
      // Валидация
      const emailValidation = this.validator.validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.errors.join(", "));
      }

      const passwordValidation = this.validator.validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(", "));
      }

      cliLogger.info("Attempting login", { email });

      const response = this.api.login<AuthResponseDto>({
        email,
        password,
      });

      if (response.status !== 200) {
        throw new Error(response.message || "Login failed");
      }

      // Сохраняем токен и данные пользователя
      storageService.setAuth({
        user: response.data.user,
        token: response.data.token,
      });

      cliLogger.info("Login successful", { userId: response.data.user.id });

      return {
        data: response.data,
        result: "success",
        errors: [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      cliLogger.error("Login failed", { error: errorMessage, email });

      return {
        data: {} as AuthResponseDto,
        result: "error",
        errors: [errorMessage],
      };
    }
  };

  /**
   * Регистрация пользователя
   */
  register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ data: AuthResponseDto; result: string; errors: string[] }> => {
    try {
      // Валидация
      const nameValidation = this.validator.validateName(name);
      if (!nameValidation.isValid) {
        throw new Error(nameValidation.errors.join(", "));
      }

      const emailValidation = this.validator.validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.errors.join(", "));
      }

      const passwordValidation = this.validator.validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(", "));
      }

      cliLogger.info("Attempting registration", { email, name });

      const response = this.api.register<AuthResponseDto>({
        email,
        password,
        name,
      });

      if (response.status !== 201) {
        throw new Error(response.message || "Registration failed");
      }

      // Сохраняем токен и данные пользователя
      storageService.setAuth({
        user: response.data.user,
        token: response.data.token,
      });

      cliLogger.info("Registration successful", {
        userId: response.data.user.id,
      });

      return {
        data: response.data,
        result: "success",
        errors: [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      cliLogger.error("Registration failed", { error: errorMessage, email });

      return {
        data: {} as AuthResponseDto,
        result: "error",
        errors: [errorMessage],
      };
    }
  };

  /**
   * Выход из системы
   */
  logout = async (): Promise<{ result: string; errors: string[] }> => {
    try {
      const token = storageService.getToken();

      if (token) {
        await this.api.logout({ token });
        cliLogger.info("Logout API call successful");
      }

      // Очищаем локальное хранилище
      storageService.clear();

      cliLogger.info("Logout successful");

      return {
        result: "success",
        errors: [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      cliLogger.error("Logout failed", { error: errorMessage });

      return {
        result: "error",
        errors: [errorMessage],
      };
    }
  };

  /**
   * Проверка авторизации
   */
  isAuthenticated = (): boolean => {
    return storageService.isAuthenticated();
  };

  /**
   * Получение текущего пользователя
   */
  getCurrentUser = (): UserDto | null => {
    return storageService.getUser();
  };
}
