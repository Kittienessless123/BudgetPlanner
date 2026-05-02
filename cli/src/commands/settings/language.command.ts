// commands/settings/language.command.ts
import { Command } from 'commander';
import { i18n, Language } from '../../core-modules/locales/index.js';

export class LanguageCommand {
  register(program: Command): void {
    program
      .command('lang')
      .description('Change CLI language / Сменить язык интерфейса')
      .argument('<lang>', 'Language code: en, ru')
      .action((lang: string) => {
        if (lang === 'en' || lang === 'ru') {
          i18n.setLanguage(lang);
          console.log(i18n.t('messages.success'));
          console.log(`Language changed to ${lang}`);
        } else {
          console.error(i18n.t('errors.invalidInput', { field: 'language' }));
        }
      });
  }
}