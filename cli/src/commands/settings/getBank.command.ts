// commands/bank/get.command.ts
import { Command } from "commander";
import { BankService } from "../../services/bank.service.js";
import { storageService } from "../../services/storage.service.js";
import { cliLogger, log, withLogging } from "../../utils/logger.js";
import { i18n } from "../../locales/index.js";

interface GetBankOptions {
  id: string;
}

export class GetBankCommand {
  private bankService: BankService;

  constructor() {
    this.bankService = new BankService();
  }

  register(program: Command): void {
    program
      .command("get")
      .description(i18n.commandDescription("bank.get"))
      .argument("<id>", i18n.arguments.bankId)
      .action(async (id: string) => {
        await withLogging("bank-get", async () => {
          await this.execute({ id });
        });
      });
  }

  private async execute(options: GetBankOptions): Promise<void> {
    const token = storageService.getToken();

    if (!token) {
      log.error(i18n.t("errors.unauthorized"));
      process.exit(1);
    }

    log.info(i18n.t("messages.fetchingBank"));
    const result = await this.bankService.getBank(token, options.id);

    if (result.result === "success") {
      console.log(`\n📋 ${i18n.t("headers.bankDetails")}`);
      console.log("-".repeat(40));
      console.log(`  ${i18n.t("fields.bankId")}: ${result.data.id}`);
      console.log(`  ${i18n.t("fields.bankName")}: ${result.data.name}`);
      console.log(`  ${i18n.t("fields.bankCode")}: ${result.data.code || "-"}`);
      console.log(
        `  ${i18n.t("fields.country")}: ${result.data.country || "-"}`,
      );
      if (result.data.createdAt) {
        console.log(
          `  ${i18n.t("fields.createdAt")}: ${new Date(result.data.createdAt).toLocaleString()}`,
        );
      }
      console.log("");
      cliLogger.info("Bank fetched successfully", { bankId: options.id });
    } else {
      log.error(i18n.t("errors.bankFetchFailed"));
      result.errors.forEach((err) => log.data(`  - ${err}`));
      process.exit(1);
    }
  }
}
