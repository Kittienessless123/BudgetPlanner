import { Command } from "commander";
import { AccountService } from "../../services/account.service";

export class DeleteCommand {
  accService: AccountService = new AccountService();

  register(program: Command): void {
    program
      .command("account")
      .description("Delele Account")
      .option("-e, --email <email>", "User email")
      .option("-n, --name <name>", "User name")
      .option("-p, --password <password>", "User password")
      .action((options: DeleteOptions) => {
        this.execute(options);
      });
  }

  private async execute(options: DeleteOptions): Promise<void> {
    const result = this.accService.delete();
  }
}
