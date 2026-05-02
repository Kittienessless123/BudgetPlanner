// src/commands/auth/login.command.ts
import { Command } from "commander";
import { AuthService } from "../../services/auth.service";

interface RegisterOptions {
  email?: string;
  password?: string;
  name?:string
}

export class RegisterCommand {
  authService: AuthService = new AuthService();

  register(program: Command): void {
    program
      .command("register")
      .description("Register in budget planner")
      .option("-e, --email <email>", "User email")
      .option("-p, --password <password>", "User password")
      .option("-n, --name <name>", "User name")
      .action((options: RegisterOptions) => {
        this.execute(options);
      });
  }

  private async execute(options: RegisterOptions): Promise<void> {

    console.log("🔐 Logging in...", options.email);
    const result = this.authService.register(options.email, options.password, options.name);
    console.log("Login result..." + result);
  }
}
