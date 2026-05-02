import { Command } from "commander";
import { AccountService } from "../../services/account.service.js";
import { cliLogger, log, withLogging } from "../../utils/logger.util.ts";
import { i18n } from "../../core-modules/locales/index.js";
import { storageService } from "../../core-modules/storage/index.ts";

interface ChangeUserInfoOptions {
  email?: string;
  name?: string;
  password?: string;
  currency?: string;
}

export class ChangeUserInfoCommand {
  private accService: AccountService;

  constructor() {
    this.accService = new AccountService("", "", "");
  }

  register(program: Command): void {
    program
      .command("account-update")
      .description(i18n.commandDescription("account.update"))
      .option(
        "-e, --email <email>",
        i18n.optionDescription("account.update", "email"),
      )
      .option(
        "-n, --name <name>",
        i18n.optionDescription("account.update", "name"),
      )
      .option(
        "-c, --currency <currency>",
        i18n.optionDescription("account.update", "currency"),
      )
      .action(async (options: ChangeUserInfoOptions) => {
        await withLogging("account-update", async () => {
          await this.execute(options);
        });
      });
  }

  private async execute(options: ChangeUserInfoOptions): Promise<void> {
    const token = storageService.getToken();

    if (!token) {
      log.error(i18n.t("errors.unauthorized"));
      cliLogger.warn("Attempt to update user info without token");
      process.exit(1);
    }

    // Собираем только те поля, которые нужно обновить
    const updateData: Partial<{
      name: string;
      email: string;
      defaultCurrency: string;
    }> = {};

    if (options.name) {
      this.accService.setName(options.name);
      updateData.name = options.name;
    }
    if (options.email) {
      this.accService.setEmail(options.email);
      updateData.email = options.email;
    }
    if (options.currency) {
      updateData.defaultCurrency = options.currency;
    }

    if (Object.keys(updateData).length === 0) {
      log.warn(i18n.t("warnings.noDataToUpdate"));
      cliLogger.info("No data provided for update");
      return;
    }

    cliLogger.info("Updating user info", updateData);
    log.info(i18n.t("messages.updating"));

    const result = await this.accService.put(token, updateData);

    if (result.result === "success") {
      log.success(i18n.t("messages.updateSuccess"));
      console.log("\n📋 " + i18n.t("headers.updatedInfo"));
      console.log(`  ${i18n.t("fields.name")}: ${result.data.name}`);
      console.log(`  ${i18n.t("fields.email")}: ${result.data.email}`);
      cliLogger.info("User info updated successfully", {
        userId: result.data.id,
      });
    } else {
      log.error(i18n.t("errors.updateFailed"));
      result.errors.forEach((err) => log.data(`  - ${err}`));
      cliLogger.error("Failed to update user info", { errors: result.errors });
      process.exit(1);
    }
  }
}
