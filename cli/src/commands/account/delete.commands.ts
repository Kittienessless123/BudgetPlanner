import { Command } from "commander";
import { AccountService } from "../../services/account.service.js";
import { cliLogger, log, withLogging } from "../../utils/logger.util.ts";
import { i18n } from "../../core-modules/locales/index.js";
import { storageService } from "../../core-modules/storage/index.ts";
import inquirer from "inquirer";

interface DeleteOptions {
  email?: string;
  name?: string;
  password?: string;
  force?: boolean;
}

export class DeleteCommand {
  private accService: AccountService;

  constructor() {
    this.accService = new AccountService("", "", "");
  }

  register(program: Command): void {
    program
      .command("account-delete")
      .description(i18n.commandDescription("account.delete"))
      .option("-f, --force", i18n.optionDescription("account.delete", "force"))
      .action(async (options: DeleteOptions) => {
        await withLogging("account-delete", async () => {
          await this.execute(options);
        });
      });
  }

  private async execute(options: DeleteOptions): Promise<void> {
    const token = storageService.getToken();
    
    if (!token) {
      log.error(i18n.t("errors.unauthorized"));
      cliLogger.warn("Attempt to delete account without token");
      process.exit(1);
    }

    // Подтверждение удаления
    if (!options.force) {
      log.warn(i18n.t("warnings.deleteConfirmation"));
      const { confirm } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: i18n.t("questions.confirmDelete"),
          default: false,
        },
      ]);

      if (!confirm) {
        log.info(i18n.t("messages.deleteCancelled"));
        cliLogger.info("Account deletion cancelled by user");
        return;
      }

      const { confirmText } = await inquirer.prompt([
        {
          type: "input",
          name: "confirmText",
          message: i18n.t("questions.typeDelete"),
          validate: (input: string) => {
            if (input === "DELETE") return true;
            return i18n.t("errors.invalidConfirmation");
          },
        },
      ]);
    }

    cliLogger.warn("Attempting to delete user account");
    log.warn(i18n.t("messages.deleting"));

    const result = await this.accService.delete(token);

    if (result.result === "success") {
      // Очищаем сохранённые данные
      storageService.clear();
      log.success(i18n.t("messages.deleteSuccess"));
      cliLogger.info("User account deleted successfully", { userId: result.data.id });
      console.log(i18n.t("messages.goodbye"));
      process.exit(0);
    } else {
      log.error(i18n.t("errors.deleteFailed"));
      result.errors.forEach(err => log.data(`  - ${err}`));
      cliLogger.error("Failed to delete user account", { errors: result.errors });
      process.exit(1);
    }
  }
}