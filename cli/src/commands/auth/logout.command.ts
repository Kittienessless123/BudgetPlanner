// src/commands/auth/login.command.ts
import { Command } from "commander";
import { AuthService } from "../../services/auth.service";

interface LogoutOptions {
  token?: string;
}

export class LogoutCommand {
  authService: AuthService = new AuthService();

  register(program: Command): void {
    program
      .command("register")
      .description("Register in budget planner")
      .option("-e, --email <email>", "User email")
      .option("-p, --password <password>", "User password")
      .option("-n, --name <name>", "User name")
      .action((options: LogoutOptions) => {
        this.execute(options);
      });
  }

  private async execute(options: LogoutOptions): Promise<void> {

    console.log("🔐 Logging in...", options.token);
    const result = this.authService.logout(options.token);
    console.log("Login result..." + result);
  }
}
