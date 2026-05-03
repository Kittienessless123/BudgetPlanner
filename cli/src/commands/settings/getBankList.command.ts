// commands/bank/list.command.ts
import { Command } from "commander";
import { BankService } from "../../services/bank.service.js";
import { storageService } from "../../services/storage.service.js";
import { cliLogger, log, withLogging } from "../../utils/logger.js";
import { i18n } from "../../locales/index.js";

interface ListBanksOptions {
  user?: boolean;
}

export class ListBanksCommand {
  private bankService: BankService;

  constructor() {
    this.bankService = new BankService();
  }

  register(program: Command): void {
    program
      .command("list")
      .description(i18n.commandDescription("bank.list"))
      .option("-u, --user", i18n.optionDescription("bank.list", "user"), false)
      .action(async (options: ListBanksOptions) => {
        await withLogging("bank-list", async () => {
          await this.execute(options);
        });
      });
  }

  private async execute(options: ListBanksOptions): Promise<void> {
    const token = storageService.getToken();

    if (!token) {
      log.error(i18n.t("errors.unauthorized"));
      process.exit(1);
    }

    log.info(
      options.user
        ? i18n.t("messages.fetchingUserBanks")
        : i18n.t("messages.fetchingBanks"),
    );

    let result;
    if (options.user) {
      result = await this.bankService.getAllUserBanks(token);
    } else {
      result = await this.bankService.getAllBanks(token);
    }

    if (result.result === "success" && result.data.length > 0) {
      const title = options.user
        ? i18n.t("headers.userBanks")
        : i18n.t("headers.systemBanks");
      console.log(`\n📋 ${title}`);
      console.log("=".repeat(60));

      const tableData = result.data.map((bank) => ({
        [i18n.t("fields.bankId")]: bank.id,
        [i18n.t("fields.bankName")]: bank.name,
        [i18n.t("fields.bankCode")]: bank.code || "-",
        [i18n.t("fields.country")]: bank.country || "-",
      }));

      console.table(tableData);
      console.log(`${i18n.t("messages.totalCount")}: ${result.data.length}\n`);
      cliLogger.info("Banks listed successfully", {
        count: result.data.length,
        userBanks: options.user,
      });
    } else if (result.data.length === 0) {
      log.info(i18n.t("messages.noBanksFound"));
    } else {
      log.error(i18n.t("errors.bankListFailed"));
      result.errors.forEach((err) => log.data(`  - ${err}`));
    }
  }
}
