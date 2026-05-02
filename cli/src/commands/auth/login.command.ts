import { Command } from "commander";
import { AuthService } from "../../services/auth.service";

interface LoginOptions {
  email?: string;
  password?: string;
}

export class LoginCommand {
  authService: AuthService = new AuthService();

  register(program: Command): void {
    program
      .command("login")
      .description("Login to budget planner")
      .option("-e, --email <email>", "User email")
      .option("-p, --password <password>", "User password")
      .action((options: LoginOptions) => {
        this.execute(options);
      });
  }

  private async execute(options: LoginOptions): Promise<void> {

    const result = this.authService.login(options.email, options.password);
    console.log("Register result..." + result);
  }
}

