// cli-theme.js
const chalk = require("chalk");
const figlet = require("figlet");
const gradient = require("gradient-string");

// Задаем цветовую схему проекта в одном месте
const theme = {
  primary: chalk.hex("#6C63FF"), // Твой фирменный цвет
  success: chalk.green,
  error: chalk.red.bold,
  warning: chalk.yellow,
  info: chalk.blue,
  highlight: chalk.bgCyan.black.bold,
};

// Создаем утилиты для форматирования
const formatters = {
  // Баннер при запуске
  showBanner: () => {
    console.log(
      gradient.passion(
        figlet.textSync("Budget CLI", { horizontalLayout: "full" }),
      ),
    );
    console.log(chalk.dim("Версия 1.0.0 | Управляй своим бюджетом\n"));
  },

  // Единообразные сообщения
  success: (msg: string) => console.log(`${theme.success("✓ УСПЕХ:")} ${msg}`),
  error: (msg: string) => console.log(`${theme.error("✗ ОШИБКА:")} ${msg}`),
  info: (msg: string) => console.log(`${theme.info("ℹ ИНФО:")} ${msg}`),

  // Хелпер для форматирования таблиц
  tableHeaders: (text: string) => theme.highlight(text),
};

module.exports = { theme, formatters };
