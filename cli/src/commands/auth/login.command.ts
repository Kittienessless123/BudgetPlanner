// commands/auth/login.command.ts
import { Command } from "commander";
import { i18n } from "../../core-modules/locales/index.ts";
import { storageService } from "../../core-modules/storage/index.ts";

export class LoginCommand {
  register(program: Command): void {
    program
      .command(i18n.commandName("auth.login"))
      .description(i18n.commandDescription("auth.login"))
      .option(
        "-e, --email <email>",
        i18n.optionDescription("auth.login", "email"),
      )
      .option(
        "-p, --password <password>",
        i18n.optionDescription("auth.login", "password"),
      )
      .option(
        "-i, --interactive",
        i18n.optionDescription("auth.login", "interactive"),
      )
      .action(async (options) => {
        await this.execute(options);
      });
  }

  private async execute(options: any): Promise<void> {
    // ... логика входа

    console.log(i18n.t("messages.welcome", { name: name }));
    // Вывод: "Добро пожаловать в Budget Planner, John!" или "Welcome to Budget Planner, John!"
  }
}
