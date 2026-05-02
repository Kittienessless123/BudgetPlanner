import { Command } from "commander";
import { AuthService } from "../../services/auth.service.js";
import { cliLogger, log, withLogging } from "../../utils/logger.util.ts";
import { i18n } from "../../core-modules/locales/index.js";
import inquirer from "inquirer";

interface LoginOptions {
  email?: string;
  password?: string;
  interactive?: boolean;
}

export class LoginCommand {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register(program: Command): void {
    program
      .command("login")
      .description(i18n.commandDescription("auth.login"))
      .option("-e, --email <email>", i18n.optionDescription("auth.login", "email"))
      .option("-p, --password <password>", i18n.optionDescription("auth.login", "password"))
      .option("-i, --interactive", i18n.optionDescription("auth.login", "interactive"), false)
      .action(async (options: LoginOptions) => {
        await withLogging("auth-login", async () => {
          await this.execute(options);
        });
      });
  }

  private async execute(options: LoginOptions): Promise<void> {
    let email = options.email;
    let password = options.password;

    // Проверка, не авторизован ли уже пользователь
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      log.warn(i18n.t("warnings.alreadyLoggedIn", { name: user?.name || "" }));
      cliLogger.warn("User already logged in");
      return;
    }

    // Интерактивный режим
    if (options.interactive || (!email && !password)) {
      log.info(i18n.t("messages.interactiveMode"));
      
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "email",
          message: i18n.t("questions.email"),
          when: () => !email,
          validate: (input: string) => {
            const validator = this.authService["validator"];
            const result = validator.validateEmail(input);
            return result.isValid ? true : result.errors.join(", ");
          },
        },
        {
          type: "password",
          name: "password",
          message: i18n.t("questions.password"),
          when: () => !password,
          validate: (input: string) => {
            const validator = this.authService["validator"];
            const result = validator.validatePassword(input);
            return result.isValid ? true : result.errors.join(", ");
          },
        },
      ]);

      email = answers.email || email;
      password = answers.password || password;
    }

    if (!email || !password) {
      log.error(i18n.t("errors.missingCredentials"));
      cliLogger.warn("Missing credentials for login");
      process.exit(1);
    }

    log.info(i18n.t("messages.loggingIn"));
    cliLogger.info("Attempting login", { email });

    const result = await this.authService.login(email, password);

    if (result.result === "success") {
      log.success(i18n.t("messages.loginSuccess", { name: result.data.user.name }));
      console.log(`\n🔐 ${i18n.t("messages.tokenSaved")}`);
      console.log(`📁 ${i18n.t("messages.storagePath")}: ~/.config/budget-planner/auth.json\n`);
      cliLogger.info("Login successful", { userId: result.data.user.id });
    } else {
      log.error(i18n.t("errors.loginFailed"));
      result.errors.forEach(err => log.data(`  - ${err}`));
      cliLogger.error("Login failed", { errors: result.errors });
      process.exit(1);
    }
  }
}