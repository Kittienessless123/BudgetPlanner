import { Command } from "commander";
import { AuthService } from "../../services/auth.service.js";
import { cliLogger, log, withLogging } from "../../utils/logger.util.ts";
import { i18n } from "../../core-modules/locales/index.js";
import inquirer from "inquirer";

interface RegisterOptions {
  email?: string;
  password?: string;
  name?: string;
  interactive?: boolean;
}

export class RegisterCommand {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register(program: Command): void {
    program
      .command("register")
      .description(i18n.commandDescription("auth.register"))
      .option(
        "-e, --email <email>",
        i18n.optionDescription("auth.register", "email"),
      )
      .option(
        "-p, --password <password>",
        i18n.optionDescription("auth.register", "password"),
      )
      .option(
        "-n, --name <name>",
        i18n.optionDescription("auth.register", "name"),
      )
      .option(
        "-i, --interactive",
        i18n.optionDescription("auth.register", "interactive"),
        false,
      )
      .action(async (options: RegisterOptions) => {
        await withLogging("auth-register", async () => {
          await this.execute(options);
        });
      });
  }

  private async execute(options: RegisterOptions): Promise<void> {
    let name = options.name;
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
    if (options.interactive || (!email && !password && !name)) {
      log.info(i18n.t("messages.interactiveMode"));

      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: i18n.t("questions.name"),
          when: () => !name,
          validate: (input: string) => {
            const validator = this.authService["validator"];
            const result = validator.validateName(input);
            return result.isValid ? true : result.errors.join(", ");
          },
        },
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
        {
          type: "password",
          name: "confirmPassword",
          message: i18n.t("questions.confirmPassword"),
          when: () => !password,
          validate: (input: string, answers: any) => {
            if (input !== answers.password) {
              return i18n.t("errors.passwordsDoNotMatch");
            }
            return true;
          },
        },
      ]);

      name = answers.name || name;
      email = answers.email || email;
      password = answers.password || password;
    }

    if (!name || !email || !password) {
      log.error(i18n.t("errors.missingRegistrationData"));
      cliLogger.warn("Missing registration data");
      process.exit(1);
    }

    log.info(i18n.t("messages.registering"));
    cliLogger.info("Attempting registration", { email, name });

    const result = await this.authService.register(email, password, name);

    if (result.result === "success") {
      log.success(
        i18n.t("messages.registerSuccess", { name: result.data.user.name }),
      );
      console.log(`\n🎉 ${i18n.t("messages.welcome")}`);
      console.log(`🔐 ${i18n.t("messages.tokenSaved")}\n`);
      cliLogger.info("Registration successful", {
        userId: result.data.user.id,
      });
    } else {
      log.error(i18n.t("errors.registerFailed"));
      result.errors.forEach((err) => log.data(`  - ${err}`));
      cliLogger.error("Registration failed", { errors: result.errors });
      process.exit(1);
    }
  }
}
