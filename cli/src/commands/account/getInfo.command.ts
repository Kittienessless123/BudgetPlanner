import { Command } from "commander";
import { AccountService } from "../../services/account.service";

export class GetUserInfoCommand {
  accService: AccountService = new AccountService();

  register(program: Command): void {
    program
      .command("account")
      .description("Get user info")
      .option("-e, --email <email>", "User email")
      .option("-n, --name <name>", "User name")
      .option("-p, --password <password>", "User password")
      .action((options: GetUserInfoOptions) => {
        this.execute(options);
      });
  }

  private async execute(options: GetUserInfoOptions): Promise<void> {
    const result = this.accService.get();
  }
}
