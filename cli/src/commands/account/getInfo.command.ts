import { Command } from "commander";
import { AccountService } from "../../services/account.service.js";
import { cliLogger, log, withLogging } from "../../utils/logger.util.ts";
import { i18n } from "../../core-modules/locales/index.js";
import { storageService } from "../../core-modules/storage/index.ts";

interface GetUserInfoOptions {
  email?: string;
  name?: string;
  password?: string;
}

export class GetUserInfoCommand {
  private accService: AccountService;

  constructor() {
    this.accService = new AccountService("", "", "");
  }

  register(program: Command): void {
    program
      .command("account-get")
      .description(i18n.commandDescription("account.get"))
      .option("-e, --email <email>", i18n.optionDescription("account.get", "email"))
      .option("-n, --name <name>", i18n.optionDescription("account.get", "name"))
      .action(async (options: GetUserInfoOptions) => {
        await withLogging("account-get", async () => {
          await this.execute(options);
        });
      });
  }

  private async execute(options: GetUserInfoOptions): Promise<void> {
    const token = storageService.getToken();
    
    if (!token) {
      log.error(i18n.t("errors.unauthorized"));
      cliLogger.warn("Attempt to get user info without token");
      process.exit(1);
    }

    cliLogger.info("Fetching user info", { email: options.email });
    log.info(i18n.t("messages.fetching"));

    const result = await this.accService.get(token);

    if (result.result === "success") {
      log.success(i18n.t("messages.fetchSuccess"));
      console.log("\n📋 " + i18n.t("headers.userInfo"));
      console.log(`  ${i18n.t("fields.name")}: ${result.data.name}`);
      console.log(`  ${i18n.t("fields.email")}: ${result.data.email}`);
      console.log(`  ${i18n.t("fields.defaultCurrency")}: ${result.data.defaultCurrency || "RUB"}`);
      cliLogger.info("User info fetched successfully", { userId: result.data.id });
    } else {
      log.error(i18n.t("errors.fetchFailed"));
      result.errors.forEach(err => log.data(`  - ${err}`));
      cliLogger.error("Failed to fetch user info", { errors: result.errors });
      process.exit(1);
    }
  }
}