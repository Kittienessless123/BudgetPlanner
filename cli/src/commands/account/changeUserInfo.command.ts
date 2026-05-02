import { Command } from "commander";
import { AccountService } from "../../services/account.service";

export class ChangeUserInfoCommand {
  accService: AccountService = new AccountService();

  register(program: Command): void {
    program
      .command("account")
      .description("Change user info")
      .option("-e, --email <email>", "User email")
      .option("-n, --name <name>", "User name")
      .option("-p, --password <password>", "User password")
      .action((options: ChangeUserInfoOptions) => {
        this.execute(options);
      });
  }

  private async execute(options: ChangeUserInfoOptions): Promise<void> {
    const result = this.accService.put(
      options.email,
      options.name,
      options.password,
    );
  }
}
