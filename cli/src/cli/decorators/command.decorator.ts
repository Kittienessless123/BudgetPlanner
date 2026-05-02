// cli/decorators/command.decorator.ts
import { i18n } from '../../core-modules/locales/index.ts';
import { Command } from "commander";

export function LocalizedCommand(cmdPath: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(program: Command) {
      const cmd = program
        .command(i18n.commandName(cmdPath))
        .description(i18n.commandDescription(cmdPath));
      
      return originalMethod.call(this, cmd);
    };
    
    return descriptor;
  };
}

export function LocalizedOption(cmdPath: string, optionFlag: string, optionName: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(cmd: Command) {
      const description = i18n.optionDescription(cmdPath, optionName);
      cmd.option(optionFlag, description);
      
      return originalMethod.call(this, cmd);
    };
    
    return descriptor;
  };
}