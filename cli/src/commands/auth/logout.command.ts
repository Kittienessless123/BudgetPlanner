import { Command } from "commander";
import { AuthService } from "../../services/auth.service.js";
import { cliLogger, log, withLogging } from "../../utils/logger.util.ts";
import { i18n } from "../../core-modules/locales/index.js";

export class LogoutCommand {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register(program: Command): void {
    program
      .command("logout")
      .description(i18n.commandDescription("auth.logout"))
      .action(async () => {
        await withLogging("auth-logout", async () => {
          await this.execute();
        });
      });
  }

  private async execute(): Promise<void> {
    // Проверка авторизации
    if (!this.authService.isAuthenticated()) {
      log.warn(i18n.t("warnings.notLoggedIn"));
      cliLogger.warn("Logout attempt while not logged in");
      return;
    }

    const user = this.authService.getCurrentUser();
    log.info(i18n.t("messages.loggingOut", { name: user?.name || "" }));
    cliLogger.info("Attempting logout", { userId: user?.id });

    const result = await this.authService.logout();

    if (result.result === "success") {
      log.success(i18n.t("messages.logoutSuccess"));
      console.log(i18n.t("messages.goodbye"));
      cliLogger.info("Logout successful");
    } else {
      log.error(i18n.t("errors.logoutFailed"));
      result.errors.forEach((err) => log.data(`  - ${err}`));
      cliLogger.error("Logout failed", { errors: result.errors });
      process.exit(1);
    }
  }
}
