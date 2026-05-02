// src/cli/registry.ts
import { Command } from "commander";
import { AuthCommands } from "../commands/auth/auth.commander";
import { WalletCommands } from "../commands/wallet/wallet.commander";
import { SettingsCommands } from "../commands/settings/settings.commander";

export interface ICommand {
  register(program: Command): void;
}

export class CommandRegistry {
  private commands: ICommand[] = [];

  constructor() {
    this.commands.push(
      new AuthCommands(),
      new WalletCommands(),
      new SettingsCommands(),
    );
  }

  registerAll(program: Command): void {
    this.commands.forEach((cmd) => cmd.register(program));
  }
}
