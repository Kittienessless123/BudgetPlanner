// services/cron.service.ts
import { ScheduleDto } from "../../dto";
import * as path from "node:path";
import * as fs from "fs";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface CronJobInfo {
  id: string;
  name: string;
  cronExpression: string;
  command: string;
  scriptPath: string;
  enabled: boolean;
}

export class CronService {
  private cronJobsPath: string;
  private scriptsDir: string;

  constructor() {
    // Директория для хранения CRON скриптов
    this.scriptsDir = path.join(
      process.env.HOME || process.env.USERPROFILE || __dirname,
      ".budget-planner",
      "cron-jobs",
    );
    this.cronJobsPath = path.join(this.scriptsDir, "jobs.json");
    this.init();
  }

  /**
   * Инициализация директории для CRON скриптов
   */
  private init(): void {
    if (!fs.existsSync(this.scriptsDir)) {
      fs.mkdirSync(this.scriptsDir, { recursive: true });
    }
    if (!fs.existsSync(this.cronJobsPath)) {
      fs.writeFileSync(this.cronJobsPath, JSON.stringify([], null, 2));
    }
  }

  /**
   * Генерация CRON выражения на основе расписания
   */
  generateCronExpression(schedule: {
    type: "daily" | "weekly" | "monthly" | "custom";
    day?: number; // день недели (0-6) или число месяца
    hour?: number; // час (0-23)
    minute?: number; // минута (0-59)
    custom?: string; // кастомное выражение
  }): string {
    const minute = schedule.minute ?? 0;
    const hour = schedule.hour ?? 9;

    switch (schedule.type) {
      case "daily":
        return `${minute} ${hour} * * *`;
      case "weekly":
        const day = schedule.day ?? 1; // Понедельник по умолчанию
        return `${minute} ${hour} * * ${day}`;
      case "monthly":
        const monthDay = schedule.day ?? 1; // 1 число месяца
        return `${minute} ${hour} ${monthDay} * *`;
      case "custom":
        return schedule.custom || "0 9 * * *";
      default:
        return "0 9 * * *"; // default: каждый день в 9 утра
    }
  }

  /**
   * Создание скрипта для конкретного задания
   */
  createCronScript(scheduleDto: ScheduleDto): {
    result: boolean;
    path: string;
    error?: string;
  } {
    try {
      // Генерируем уникальное имя файла
      const scriptName = `job_${scheduleDto.id || Date.now()}.${this.getScriptExtension()}`;
      const scriptPath = path.join(this.scriptsDir, scriptName);

      // Генерируем содержимое скрипта
      const scriptContent = this.generateScriptContent(scheduleDto);

      // Сохраняем скрипт
      fs.writeFileSync(scriptPath, scriptContent);

      // Делаем скрипт исполняемым (для Linux/macOS)
      if (process.platform !== "win32") {
        fs.chmodSync(scriptPath, "755");
      }

      // Сохраняем информацию о задании
      const jobs = this.getAllJobs();
      jobs.push({
        id: scheduleDto.id || Date.now().toString(),
        name: scheduleDto.name,
        cronExpression: scheduleDto.cronExpression,
        command: `node ${scriptPath}`,
        scriptPath: scriptPath,
        enabled: true,
      });
      this.saveJobs(jobs);

      // Регистрируем в системном CRON
      this.registerInSystemCron(
        scheduleDto.id || Date.now().toString(),
        scheduleDto.cronExpression,
        scriptPath,
      );

      return { result: true, path: scriptPath };
    } catch (err) {
      console.error("Ошибка создания CRON скрипта:", err);
      return {
        result: false,
        path: "",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  /**
   * Генерация содержимого скрипта
   */
  private generateScriptContent(scheduleDto: ScheduleDto): string {
    const isWindows = process.platform === "win32";

    if (isWindows) {
      // PowerShell скрипт для Windows
      return `
# CRON Job: ${scheduleDto.name}
# Создан: ${new Date().toISOString()}

$notificationTitle = "Budget Planner - ${scheduleDto.name}"
$notificationMessage = "Напоминание: ${scheduleDto.name}"

# Путь к твоему CLI приложению
$cliPath = "budget-planner"

# Выполняем команду
& $cliPath schedule run --id ${scheduleDto.id}

# Отправляем уведомление
Write-Host "CRON job executed: ${scheduleDto.name} at $(Get-Date)" >> "$env:USERPROFILE\\.budget-planner\\cron-logs.txt"
      `.trim();
    } else {
      // Bash скрипт для Linux/macOS
      return `#!/bin/bash
# CRON Job: ${scheduleDto.name}
# Создан: $(date)

NOTIFICATION_TITLE="Budget Planner - ${scheduleDto.name}"
NOTIFICATION_MESSAGE="Напоминание: ${scheduleDto.name}"

# Путь к твоему CLI приложению
CLI_PATH="budget-planner"

# Выполняем команду
$CLI_PATH schedule run --id ${scheduleDto.id}

# Отправляем уведомление через toasted-notifier
# (будет вызвано из CLI команды)

echo "CRON job executed: ${scheduleDto.name} at $(date)" >> "$HOME/.budget-planner/cron-logs.txt"
      `.trim();
    }
  }

  /**
   * Получение расширения скрипта в зависимости от ОС
   */
  private getScriptExtension(): string {
    return process.platform === "win32" ? "ps1" : "sh";
  }

  /**
   * Регистрация задания в системном CRON
   */
  private async registerInSystemCron(
    jobId: string,
    cronExpression: string,
    scriptPath: string,
  ): Promise<void> {
    const isWindows = process.platform === "win32";

    if (isWindows) {
      // Windows: используем Task Scheduler через PowerShell
      const taskName = `BudgetPlanner_${jobId}`;
      const psCommand = `
        $action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-File "${scriptPath}"'
        $trigger = New-ScheduledTaskTrigger -Daily -At 9am
        Register-ScheduledTask -TaskName "${taskName}" -Action $action -Trigger $trigger -Force
      `;
      await execAsync(
        `powershell -Command "${psCommand.replace(/"/g, '\\"')}"`,
      );
    } else {
      // Linux/macOS: добавляем в crontab
      const cronLine = `${cronExpression} ${scriptPath} > /dev/null 2>&1`;

      // Получаем текущий crontab
      const { stdout: currentCrontab } = await execAsync("crontab -l").catch(
        () => ({ stdout: "" }),
      );

      // Добавляем новую строку
      const newCrontab =
        currentCrontab + `\n# Budget Planner Job: ${jobId}\n${cronLine}\n`;

      // Сохраняем
      await execAsync(`echo "${newCrontab}" | crontab -`);
    }
  }

  /**
   * Изменение существующего CRON скрипта
   */
  async changeCronScript(
    jobId: string,
    newSchedule: Partial<ScheduleDto>,
  ): Promise<boolean> {
    try {
      const jobs = this.getAllJobs();
      const jobIndex = jobs.findIndex((j) => j.id === jobId);

      if (jobIndex === -1) {
        throw new Error(`Job with id ${jobId} not found`);
      }

      // Обновляем задание
      const job = jobs[jobIndex];
      if (newSchedule.cronExpression) {
        job.cronExpression = newSchedule.cronExpression;
      }
      if (newSchedule.name) {
        job.name = newSchedule.name;
      }

      // Обновляем скрипт
      const updatedDto = { ...job, ...newSchedule };
      fs.writeFileSync(
        job.scriptPath,
        this.generateScriptContent(updatedDto as ScheduleDto),
      );

      // Перерегистрируем в CRON
      await this.unregisterFromSystemCron(jobId);
      await this.registerInSystemCron(
        jobId,
        job.cronExpression,
        job.scriptPath,
      );

      this.saveJobs(jobs);
      return true;
    } catch (err) {
      console.error("Ошибка изменения CRON скрипта:", err);
      return false;
    }
  }

  /**
   * Удаление CRON скрипта
   */
  async deleteCronScript(jobId: string): Promise<boolean> {
    try {
      const jobs = this.getAllJobs();
      const job = jobs.find((j) => j.id === jobId);

      if (job) {
        // Удаляем файл скрипта
        if (fs.existsSync(job.scriptPath)) {
          fs.unlinkSync(job.scriptPath);
        }

        // Удаляем из системного CRON
        await this.unregisterFromSystemCron(jobId);

        // Удаляем из списка
        const updatedJobs = jobs.filter((j) => j.id !== jobId);
        this.saveJobs(updatedJobs);
      }

      return true;
    } catch (err) {
      console.error("Ошибка удаления CRON скрипта:", err);
      return false;
    }
  }

  /**
   * Выполнение CRON скрипта вручную
   */
  async executeCronScript(
    jobId: string,
  ): Promise<{ success: boolean; output: string; error?: string }> {
    try {
      const jobs = this.getAllJobs();
      const job = jobs.find((j) => j.id === jobId);

      if (!job) {
        throw new Error(`Job with id ${jobId} not found`);
      }

      // Выполняем команду
      const { stdout, stderr } = await execAsync(job.command);

      return {
        success: true,
        output: stdout,
        error: stderr || undefined,
      };
    } catch (err) {
      return {
        success: false,
        output: "",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  /**
   * Получение всех заданий
   */
  getAllJobs(): CronJobInfo[] {
    try {
      const data = fs.readFileSync(this.cronJobsPath, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  /**
   * Сохранение заданий
   */
  private saveJobs(jobs: CronJobInfo[]): void {
    fs.writeFileSync(this.cronJobsPath, JSON.stringify(jobs, null, 2));
  }

  /**
   * Удаление из системного CRON
   */
  private async unregisterFromSystemCron(jobId: string): Promise<void> {
    const isWindows = process.platform === "win32";

    if (isWindows) {
      const taskName = `BudgetPlanner_${jobId}`;
      await execAsync(`schtasks /delete /tn "${taskName}" /f`).catch(() => {});
    } else {
      // Удаляем из crontab
      const { stdout: currentCrontab } = await execAsync("crontab -l").catch(
        () => ({ stdout: "" }),
      );
      const lines = currentCrontab.split("\n");
      const filteredLines = lines.filter(
        (line) => !line.includes(`# Budget Planner Job: ${jobId}`),
      );
      await execAsync(`echo "${filteredLines.join("\n")}" | crontab -`);
    }
  }

  /**
   * Создание расписания для кредита
   */
  createCreditSchedule(
    creditId: string,
    paymentDay: number,
    paymentAmount: number,
  ): ScheduleDto {
    return {
      id: `credit_${creditId}`,
      name: `Оплата кредита #${creditId}`,
      cronExpression: this.generateCronExpression({
        type: "monthly",
        day: paymentDay,
        hour: 9,
        minute: 0,
      }),
      action: "payment",
      parameters: {
        type: "credit",
        id: creditId,
        amount: paymentAmount,
      },
      isActive: true,
    } as ScheduleDto;
  }

  /**
   * Создание расписания для долга
   */
  createDebtSchedule(
    debtId: string,
    personName: string,
    reminderDays: number[],
  ): ScheduleDto[] {
    return reminderDays.map(
      (day) =>
        ({
          id: `debt_${debtId}_reminder_${day}`,
          name: `Напоминание о долге: ${personName}`,
          cronExpression: this.generateCronExpression({
            type: "daily",
            hour: 10,
            minute: 0,
          }),
          action: "debt_reminder",
          parameters: {
            type: "debt",
            id: debtId,
            personName: personName,
            reminderDay: day,
          },
          isActive: true,
        }) as ScheduleDto,
    );
  }
}

// Экспорт синглтона
export const cronService = new CronService();
