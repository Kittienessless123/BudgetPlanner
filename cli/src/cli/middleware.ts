import { Command } from "commander";
import { AuthService } from "../services/auth.service.js";

export type CommandAction = (...args: any[]) => void | Promise<void>;

export interface ProtectedCommandOptions {
  requireAuth?: boolean;
  requireGuest?: boolean;
}

/**
 * Middleware для проверки авторизации
 */
export class AuthMiddleware {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Оборачивает действие команды проверкой авторизации
   */
  protect(
    action: CommandAction,
    options: ProtectedCommandOptions = { requireAuth: true },
  ): CommandAction {
    return async (...args: any[]) => {
      // Получаем команду из последнего аргумента (Commander передает команду последней)
      const command = args[args.length - 1];
      const isAuthenticated = await this.authService.isAuthenticated();

      // Если команда требует авторизацию, но пользователь не авторизован
      if (options.requireAuth && !isAuthenticated) {
        console.error("\n❌ Error: You must be logged in to use this command.");
        console.error("👉 Please run: budget-planner auth login");
        console.error("👉 Or register: budget-planner auth register\n");
        process.exit(1);
      }

      // Если команда только для гостей (например, login/register), но пользователь уже авторизован
      if (options.requireGuest && isAuthenticated) {
        console.error("\n❌ Error: You are already logged in.");
        console.error("👉 Please logout first: budget-planner auth logout\n");
        process.exit(1);
      }

      // Если всё ок, выполняем действие
      try {
        await action(...args);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`\n❌ Command failed: ${message}\n`);
        process.exit(1);
      }
    };
  }

  /**
   * Получить сервис авторизации (для использования в командах)
   */
  getAuthService(): AuthService {
    return this.authService;
  }
}

// Создаем singleton экземпляр
export const authMiddleware = new AuthMiddleware();
