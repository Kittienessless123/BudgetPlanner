#!/usr/bin/env node

import { Command } from 'commander';
import dotenv from 'dotenv';
/* import { ExpenseCommand } from './commands/expense.command';
import { DebtCommand } from './commands/debt.command';
import { IncomeCommand } from './commands/income.command';
 */
// Загружаем .env
dotenv.config();

// Проверяем наличие API_URL
if (!process.env.API_URL) {
  console.error('❌ Ошибка: API_URL не указан в .env');
  process.exit(1);
}

const program = new Command();

program
  .name('budget')
  .description('Budget Planner CLI - управляйте финансами из терминала')
  .version('1.0.0');

/* // Добавляем команды
program.addCommand(ExpenseCommand);
program.addCommand(DebtCommand);
program.addCommand(IncomeCommand); */

program.parse(process.argv);