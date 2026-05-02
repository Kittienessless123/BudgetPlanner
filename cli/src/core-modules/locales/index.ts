// locales/index.ts
import path from "path";
import en from "./en.json";
import ru from "./ru.json";
import * as fs from "fs";

export type Language = "en" | "ru";
export type Translations = typeof en;

const translations: Record<Language, Translations> = { en, ru };

export class I18nService {
  private static instance: I18nService;
  private currentLanguage: Language = "en";
  private translations: Translations;

  private constructor() {
    // Определяем язык из окружения или сохранённых настроек
    this.currentLanguage = this.detectLanguage();
    this.translations = translations[this.currentLanguage];
  }

  static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  private detectLanguage(): Language {
    // Проверяем сохранённые настройки
    const savedLang = process.env.BUDGET_LANG || this.loadFromStorage();

    if (savedLang === "ru") return "ru";
    if (savedLang === "en") return "en";

    // Проверяем системный язык
    const systemLang = process.env.LANG || process.env.LANGUAGE;
    if (systemLang?.startsWith("ru")) return "ru";

    return "en";
  }

  private loadFromStorage(): Language | null {
    try {
      const storagePath = path.join(
        process.env.HOME || "",
        ".budget-planner",
        "settings.json",
      );
      if (fs.existsSync(storagePath)) {
        const settings = JSON.parse(fs.readFileSync(storagePath, "utf-8"));
        return settings.language;
      }
    } catch {}
    return null;
  }

  setLanguage(lang: Language): void {
    this.currentLanguage = lang;
    this.translations = translations[lang];
    this.saveToStorage(lang);
  }

  private saveToStorage(lang: Language): void {
    // Сохраняем настройки языка
    const settingsPath = path.join(
      process.env.HOME || "",
      ".budget-planner",
      "settings.json",
    );
    const dir = path.dirname(settingsPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const settings = { language: lang };
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  t(key: string, params?: Record<string, any>): string {
    // Получаем перевод по ключу (например: "commands.auth.description")
    const keys = key.split(".");
    let value: any = this.translations;

    for (const k of keys) {
      if (value === undefined) break;
      value = value[k];
    }

    let result = value || key; // Fallback на ключ если перевода нет

    // Подставляем параметры
    if (params) {
      for (const [param, val] of Object.entries(params)) {
        result = result.replace(new RegExp(`{{${param}}}`, "g"), String(val));
      }
    }

    return result;
  }

  // Хелперы для команд
  commandName(cmdPath: string): string {
    return this.t(`commands.${cmdPath}.name`);
  }

  commandDescription(cmdPath: string): string {
    return this.t(`commands.${cmdPath}.description`);
  }

  optionDescription(cmdPath: string, optionName: string): string {
    return this.t(`commands.${cmdPath}.options.${optionName}`);
  }
}

export const i18n = I18nService.getInstance();
