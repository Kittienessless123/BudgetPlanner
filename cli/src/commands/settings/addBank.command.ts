// commands/bank/add.command.ts
import { Command } from "commander";
import { BankService } from "../../services/bank.service.js";
import { storageService } from "../../core-modules/storage";
import { cliLogger, log, withLogging } from "../../utils/logger.util.ts";
import { i18n } from "../../core-modules/locales/index.ts";
import inquirer from "inquirer";

interface AddBankOptions {
  name?: string;
  code?: string;
  country?: string;
  interactive?: boolean;
}

export class AddBankCommand {
  private bankService: BankService;

  constructor() {
    this.bankService = new BankService();
  }

  register(program: Command): void {
    program
      .command("add")
      .description(i18n.commandDescription("bank.add"))
      .option("-n, --name <name>", i18n.optionDescription("bank.add", "name"))
      .option("-c, --code <code>", i18n.optionDescription("bank.add", "code"))
      .option(
        "-C, --country <country>",
        i18n.optionDescription("bank.add", "country"),
      )
      .option(
        "-i, --interactive",
        i18n.optionDescription("bank.add", "interactive"),
        false,
      )
      .action(async (options: AddBankOptions) => {
        await withLogging("bank-add", async () => {
          await this.execute(options);
        });
      });
  }

  private async execute(options: AddBankOptions): Promise<void> {
    const token = storageService.getToken();

    if (!token) {
      log.error(i18n.t("errors.unauthorized"));
      process.exit(1);
    }

    let { name, code, country } = options;

    if (options.interactive || (!name && !code && !country)) {
      log.info(i18n.t("messages.interactiveMode"));

      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: i18n.t("questions.bankName"),
          when: () => !name,
          validate: (input: string) => {
            const validator = this.bankService["validator"];
            const result = validator.validateBankName(input);
            return result.isValid ? true : result.errors.join(", ");
          },
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

    if (!name) {
      log.error(i18n.t("errors.bankNameRequired"));
      process.exit(1);
    }

    log.info(i18n.t("messages.addingBank"));
    const result = await this.bankService.addBank(token, {
      name,
      code,
      country,
    });

    if (result.result === "success") {
      log.success(i18n.t("messages.bankAdded"));
      console.log(`\n📋 ${i18n.t("headers.bankInfo")}`);
      console.log(`  ${i18n.t("fields.bankId")}: ${result.data.id}`);
      console.log(`  ${i18n.t("fields.bankName")}: ${result.data.name}`);
      if (result.data.code)
        console.log(`  ${i18n.t("fields.bankCode")}: ${result.data.code}`);
      if (result.data.country)
        console.log(`  ${i18n.t("fields.country")}: ${result.data.country}`);
      console.log("");
    } else {
      log.error(i18n.t("errors.bankAddFailed"));
      result.errors.forEach((err) => log.data(`  - ${err}`));
      process.exit(1);
    }
  }
}
