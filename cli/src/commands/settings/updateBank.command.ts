// commands/bank/update.command.ts
import { Command } from "commander";
import { BankService } from "../../services/bank.service.js";
import { storageService } from "../../services/storage.service.js";
import { cliLogger, log, withLogging } from "../../utils/logger.js";
import { i18n } from "../../locales/index.js";
import inquirer from "inquirer";

interface UpdateBankOptions {
  id: string;
  name?: string;
  code?: string;
  country?: string;
  interactive?: boolean;
}

export class UpdateBankCommand {
  private bankService: BankService;

  constructor() {
    this.bankService = new BankService();
  }

  register(program: Command): void {
    program
      .command("update")
      .description(i18n.commandDescription("bank.update"))
      .argument("<id>", i18n.arguments.bankId)
      .option(
        "-n, --name <name>",
        i18n.optionDescription("bank.update", "name"),
      )
      .option(
        "-c, --code <code>",
        i18n.optionDescription("bank.update", "code"),
      )
      .option(
        "-C, --country <country>",
        i18n.optionDescription("bank.update", "country"),
      )
      .option(
        "-i, --interactive",
        i18n.optionDescription("bank.update", "interactive"),
        false,
      )
      .action(async (id: string, options: Omit<UpdateBankOptions, "id">) => {
        await withLogging("bank-update", async () => {
          await this.execute({ id, ...options });
        });
      });
  }

  private async execute(options: UpdateBankOptions): Promise<void> {
    const token = storageService.getToken();

    if (!token) {
      log.error(i18n.t("errors.unauthorized"));
      process.exit(1);
    }

    let { name, code, country } = options;

    if (options.interactive || (!name && !code && !country)) {
      log.info(i18n.t("messages.interactiveMode"));
      log.info(i18n.t("messages.leaveEmptyToSkip"));

      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: i18n.t("questions.bankName"),
          when: () => !name,
        },
        {
          type: "input",
          name: "code",
          message: i18n.t("questions.bankCode"),
          when: () => !code,
        },
        {
          type: "input",
          name: "country",
          message: i18n.t("questions.country"),
          when: () => !country,
        },
      ]);

      name = answers.name || name;
      code = answers.code || code;
      country = answers.country || country;
    }

    const updateData: Partial<{ name: string; code: string; country: string }> =
      {};
    if (name) updateData.name = name;
    if (code !== undefined) updateData.code = code || null;
    if (country !== undefined) updateData.country = country || null;

    if (Object.keys(updateData).length === 0) {
      log.warn(i18n.t("warnings.noDataToUpdate"));
      return;
    }

    log.info(i18n.t("messages.updatingBank"));
    const result = await this.bankService.putBank(
      token,
      options.id,
      updateData,
    );

    if (result.result === "success") {
      log.success(i18n.t("messages.bankUpdated"));
      console.log(`\n📋 ${i18n.t("headers.updatedBankInfo")}`);
      console.log(`  ${i18n.t("fields.bankId")}: ${result.data.id}`);
      console.log(`  ${i18n.t("fields.bankName")}: ${result.data.name}`);
      if (result.data.code)
        console.log(`  ${i18n.t("fields.bankCode")}: ${result.data.code}`);
      if (result.data.country)
        console.log(`  ${i18n.t("fields.country")}: ${result.data.country}`);
      console.log("");
      cliLogger.info("Bank updated successfully", { bankId: options.id });
    } else {
      log.error(i18n.t("errors.bankUpdateFailed"));
      result.errors.forEach((err) => log.data(`  - ${err}`));
      process.exit(1);
    }
  }
}
