// src/commands/auth/index.ts
import { Command } from 'commander';
import { ICommand } from '../../cli/registry.ts';
import { ChangeUserInfoCommand } from './changeUserInfo.command.ts';
import { DeleteCommand } from './delete.commands.ts';
import { GetUserInfoCommand } from './getInfo.command.ts';

export class AccountCommands implements ICommand {
  private commands = [
    new ChangeUserInfoCommand(),
    new DeleteCommand(),
    new GetUserInfoCommand()
  ];
  
  register(program: Command): void {
    const accountGroup = program.command('account')
      .description('Authentication related commands');
    
    this.commands.forEach(cmd => cmd.register(accountGroup));
  }
}


