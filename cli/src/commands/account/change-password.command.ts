import { Command } from "commander";
import { AccountService } from "../../services/account.service.js";
import { cliLogger, log, withLogging } from "../../utils/logger.util.ts";
import { i18n } from "../../core-modules/locales/index.js";
import { storageService } from "../../core-modules/storage/index.ts";
import inquirer from "inquirer";

interface ChangePasswordOptions {
  password?: string;
  newPassword?: string;
}

export class ChangePasswordCommand {
  private accService: AccountService;

  constructor() {
    this.accService = new AccountService("", "", "");
  }

  register(program: Command): void {
    program
      .command("account-change-password")
      .description(i18n.commandDescription("account.changePassword"))
      .option(
        "-p, --password <password>",
        i18n.optionDescription("account.changePassword", "currentPassword"),
      )
      .option(
        "-n, --new-password <password>",
        i18n.optionDescription("account.changePassword", "newPassword"),
      )
      .action(async (options: ChangePasswordOptions) => {
        await withLogging("account-change-password", async () => {
          await this.execute(options);
        });
      });
  }

  private async execute(options: ChangePasswordOptions): Promise<void> {
    const token = storageService.getToken();

    if (!token) {
      log.error(i18n.t("errors.unauthorized"));
      cliLogger.warn("Attempt to change password without token");
      process.exit(1);
    }

    let currentPassword = options.password;
    let newPassword = options.newPassword;

    // Интерактивный режим, если пароли не переданы
    if (!currentPassword || !newPassword) {
      log.info(i18n.t("messages.interactiveMode"));

      const answers = await inquirer.prompt([
        {
          type: "password",
          name: "currentPassword",
          message: i18n.t("questions.currentPassword"),
          when: () => !currentPassword,
        },
        {
          type: "password",
          name: "newPassword",
          message: i18n.t("questions.newPassword"),
          when: () => !newPassword,
          validate: (input: string) => {
            const validator = this.accService["validator"];
            const result = validator.validatePassword(input);
            return result.isValid ? true : result.errors.join(", ");
          },
        },
        {
          type: "password",
          name: "confirmPassword",
          message: i18n.t("questions.confirmPassword"),
          when: () => !newPassword,
          validate: (input: string, answers: any) => {
            if (input !== answers.newPassword) {
              return i18n.t("errors.passwordsDoNotMatch");
            }
            return true;
          },
        },
      ]);

      currentPassword = answers.currentPassword || currentPassword;
      newPassword = answers.newPassword || newPassword;
    }

    // Валидация нового пароля
    this.accService.setPassword(newPassword!);

    cliLogger.info("Changing user password");
    log.info(i18n.t("messages.changingPassword"));

    const result = await this.accService.changePassword(token, newPassword!);

    if (result.result === "success") {
      log.success(i18n.t("messages.passwordChanged"));
      cliLogger.info("Password changed successfully");
      console.log(i18n.t("messages.pleaseLoginAgain"));
    } else {
      log.error(i18n.t("errors.passwordChangeFailed"));
      result.errors.forEach((err) => log.data(`  - ${err}`));
      cliLogger.error("Failed to change password", { errors: result.errors });
      process.exit(1);
    }
  }
}
