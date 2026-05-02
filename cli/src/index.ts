#!/usr/bin/env node

import { Command } from 'commander';
import dotenv from 'dotenv';
import { CommandRegistry } from './cli/registry.js';

dotenv.config();

// Проверяем наличие API_URL
if (!process.env.API_URL) {
  console.error('❌ Ошибка: API_URL не указан в .env');
  process.exit(1);
}


const program = new Command();

  // Global CLI config
  program
    .name('budget-planner')
    .description('Personal budget planner CLI')
    .version('1.0.0');

  // Register all commands
  const registry = new CommandRegistry();
  registry.registerAll(program);

  // Global error handlers
  program.on('command:*', () => {
    console.error('Invalid command. See --help for available commands.');
    process.exit(1);
  });

  // Parse arguments
  program.parse();

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }

program.parse(process.argv);