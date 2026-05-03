// commands/bank/delete.command.ts
import { Command } from "commander";
import { BankService } from "../../services/bank.service.js";
import { storageService } from "../../services/storage.service.js";
import { cliLogger, log, withLogging } from "../../utils/logger.js";
import { i18n } from "../../locales/index.js";
import inquirer from "inquirer";

interface DeleteBankOptions {
  id: string;
  force?: boolean;
}

export class DeleteBankCommand {
  private bankService: BankService;

  constructor() {
    this.bankService = new BankService();
  }

  register(program: Command): void {
    program
      .command("delete")
      .description(i18n.commandDescription("bank.delete"))
      .argument("<id>", i18n.arguments.bankId)
      .option(
        "-f, --force",
        i18n.optionDescription("bank.delete", "force"),
        false,
      )
      .action(async (id: string, options: { force?: boolean }) => {
        await withLogging("bank-delete", async () => {
          await this.execute({ id, force: options.force });
        });
      });
  }

  private async execute(options: DeleteBankOptions): Promise<void> {
    const token = storageService.getToken();

    if (!token) {
      log.error(i18n.t("errors.unauthorized"));
      process.exit(1);
    }

    // Сначала получим информацию о банке
    const bankInfo = await this.bankService.getBank(token, options.id);

    if (bankInfo.result !== "success") {
      log.error(i18n.t("errors.bankNotFound"));
      process.exit(1);
    }

    if (!options.force) {
      log.warn(
        i18n.t("warnings.deleteBankConfirmation", { name: bankInfo.data.name }),
      );

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
        return;
      }
    }

    log.info(i18n.t("messages.deletingBank"));
    const result = await this.bankService.deleteBank(token, options.id);

    if (result.result === "success") {
      log.success(i18n.t("messages.bankDeleted", { name: bankInfo.data.name }));
      cliLogger.info("Bank deleted successfully", { bankId: options.id });
    } else {
      log.error(i18n.t("errors.bankDeleteFailed"));
      result.errors.forEach((err) => log.data(`  - ${err}`));
      process.exit(1);
    }
  }
}
