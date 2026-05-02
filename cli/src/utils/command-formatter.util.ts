import { Command } from 'commander';

export interface ParsedOptions {
  [key: string]: any;
}

export class CommandFormatter {
  /**
   * Парсинг аргументов команды
   */
  static parseArgument<T>(value: string, type: 'string' | 'number' | 'date' | 'boolean'): T {
    switch (type) {
      case 'number':
        const num = Number(value);
        if (isNaN(num)) throw new Error(`Invalid number: ${value}`);
        return num as T;
      case 'date':
        const date = new Date(value);
        if (isNaN(date.getTime())) throw new Error(`Invalid date: ${value}`);
        return date as T;
      case 'boolean':
        return (value === 'true' || value === '1' || value === 'yes') as T;
      case 'string':
      default:
        return value as T;
    }
  }

  /**
   * Парсинг опций команды
   */
  static parseOptions<T extends ParsedOptions>(
    options: any,
    schema: Record<keyof T, 'string' | 'number' | 'date' | 'boolean'>
  ): T {
    const result = {} as T;
    
    for (const [key, type] of Object.entries(schema)) {
      const value = options[key];
      if (value !== undefined && value !== null) {
        try {
          result[key as keyof T] = CommandFormatter.parseArgument(value, type);
        } catch (error) {
          throw new Error(`Option --${key}: ${error instanceof Error ? error.message : error}`);
        }
      }
    }
    
    return result;
  }

  /**
   * Форматирование дат для вывода
   */
  static formatDate(date: Date, format: 'iso' | 'locale' | 'short' = 'iso'): string {
    switch (format) {
      case 'iso':
        return date.toISOString().split('T')[0];
      case 'locale':
        return date.toLocaleDateString('ru-RU');
      case 'short':
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
      default:
        return date.toISOString();
    }
  }

  /**
   * Форматирование валюты
   */
  static formatCurrency(amount: number, currency: string = 'RUB'): string {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Форматирование процентов
   */
  static formatPercent(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  /**
   * Обрезка строки
   */
  static truncate(str: string, length: number = 50): string {
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  }
}


/* 
// commands/wallet/add.command.ts
import { Command } from 'commander';
import { CommandFormatter } from '../../cli/command-formatter.js';

interface AddWalletOptions {
  name: string;
  balance: number;
  currency: string;
  createdAt: Date;
}

export class AddWalletCommand {
  register(program: Command): void {
    program
      .command('wallet-add')
      .description('Add new wallet')
      .requiredOption('-n, --name <name>', 'Wallet name')
      .option('-b, --balance <balance>', 'Initial balance', '0')
      .option('-c, --currency <currency>', 'Currency', 'RUB')
      .option('-d, --date <date>', 'Creation date', new Date().toISOString())
      .action((options) => {
        // Парсим опции
        const parsed = CommandFormatter.parseOptions<AddWalletOptions>(options, {
          name: 'string',
          balance: 'number',
          currency: 'string',
          createdAt: 'date'
        });
        
        this.execute(parsed);
      });
  }

  private execute(options: AddWalletOptions): void {
    console.log('Wallet:', options.name);
    console.log('Balance:', CommandFormatter.formatCurrency(options.balance, options.currency));
    console.log('Created:', CommandFormatter.formatDate(options.createdAt, 'locale'));
  }
} */