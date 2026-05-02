// src/commands/auth/index.ts
import { Command } from 'commander';
import { ICommand } from '../../cli/registry.ts';
import { LoginCommand } from './login.command.ts';
import { LogoutCommand } from './logout.command.ts';
import { RegisterCommand } from './register.command.ts';

export class AuthCommands implements ICommand {
  private commands = [
    new LoginCommand(),
    new LogoutCommand(),
    new RegisterCommand()
  ];
  
  register(program: Command): void {
    // Create auth group
    const authGroup = program.command('auth')
      .description('Authentication related commands');
    
    this.commands.forEach(cmd => cmd.register(authGroup));
  }
}


