// commands/bank/index.ts
import { Command } from "commander";
import { ICommand } from "../../cli/registry.js";
import { AddBankCommand } from "./add.command.js";
import { ListBanksCommand } from "./list.command.js";
import { GetBankCommand } from "./get.command.js";
import { UpdateBankCommand } from "./update.command.js";
import { DeleteBankCommand } from "./delete.command.js";

export class BankCommands implements ICommand {
  private commands = [
    new AddBankCommand(),
    new ListBanksCommand(),
    new GetBankCommand(),
    new UpdateBankCommand(),
    new DeleteBankCommand(),
  ];

  register(program: Command): void {
    const bankGroup = program
      .command("bank")
      .description(i18n.commandDescription("bank.parent"));

    this.commands.forEach((cmd) => cmd.register(bankGroup));
  }
}