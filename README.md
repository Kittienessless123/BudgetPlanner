ПЛАНИРОВЩИК БЮДЖЕТА



СХЕМА БД

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     users       │       │    wallets      │       │ payment_statuses│
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │───────│ id              │       │ id              │
│ email           │       │ user_id         │       │ code            │
│ password_hash   │       │ name            │       │ name            │
│ name            │       │ currency        │       └─────────────────┘
│ default_currency│       │ current_balance │               ▲
└────────┬────────┘       └────────┬────────┘               │
         │                         │                        │
         │                         ▼                        │
         │               ┌─────────────────┐               │
         │               │wallet_balance_  │               │
         │               │    history      │               │
         │               ├─────────────────┤               │
         │               │ id              │               │
         │               │ wallet_id       │               │
         │               │ balance         │               │
         │               │ changed_at      │               │
         │               │ transaction_id  │───────────────┐
         │               │ reason          │               │
         │               └─────────────────┘               │
         │                                                 │
         │                 ┌─────────────────┐            │
         ├────────────────│   transactions   │            │
         │                 ├─────────────────┤            │
         │                 │ id              │            │
         │                 │ user_id         │            │
         │                 │ wallet_id       │            │
         │                 │ amount          │            │
         │                 │ description     │            │
         │                 │ operation_date  │            │
         │                 │ money_flow_type │◄────┐      │
         │                 │ status_id       │─────┼──────┘
         │                 │ purchase_cat_id │◄────┼──────┐
         │                 │ user_cat_id     │◄────┼──────┼──┐
         │                 │ related_tx_id   │──┐  │      │  │
         │                 └─────────────────┘  │  │      │  │
         │                         │            │  │      │  │
         │                         ▼            │  │      │  │
         │               ┌─────────────────┐    │  │      │  │
         │               │money_flow_types │    │  │      │  │
         │               ├─────────────────┤    │  │      │  │
         │               │ id              │────┘  │      │  │
         │               │ code            │       │      │  │
         │               │ name            │       │      │  │
         │               │ direction       │       │      │  │
         │               └─────────────────┘       │      │  │
         │                                         │      │  │
         │               ┌─────────────────┐       │      │  │
         ├──────────────│      debts       │       │      │  │
         │               ├─────────────────┤       │      │  │
         │               │ id              │       │      │  │
         │               │ user_id         │       │      │  │
         │               │ person_name     │       │      │  │
         │               │ direction       │       │      │  │
         │               │ current_balance │       │      │  │
         │               │ initial_tx_id   │───────┘      │  │
         │               └─────────────────┘              │  │
         │                                                │  │
         │               ┌─────────────────┐              │  │
         ├──────────────│ credit_agreements│              │  │
         │               ├─────────────────┤              │  │
         │               │ id              │              │  │
         │               │ user_id         │              │  │
         │               │ bank_id         │              │  │
         │               │ contract_number │              │  │
         │               │ principal_amount│              │  │
         │               │ current_principal│             │  │
         │               │ status          │              │  │
         │               └────────┬────────┘              │  │
         │                        │                       │  │
         │                        ▼                       │  │
         │               ┌─────────────────┐              │  │
         │               │credit_payments  │              │  │
         │               ├─────────────────┤              │  │
         │               │ id              │              │  │
         │               │ credit_agree_id │              │  │
         │               │ transaction_id  │──────────────┘  │
         │               │ payment_date    │                 │
         │               │ principal_amount│                 │
         │               │ interest_amount │                 │
         │               └─────────────────┘                 │
         │                                                    │
         │               ┌─────────────────┐                 │
         │               │payment_schedule │                 │
         │               ├─────────────────┤                 │
         │               │ id              │                 │
         │               │ credit_agree_id │                 │
         │               │ scheduled_date  │                 │
         │               │ scheduled_total │                 │
         │               │ payment_id      │─────────────────┘
         │               │ payment_status  │
         │               └─────────────────┘
         │
         │               ┌─────────────────┐
         │               │   purchase_     │
         │               │   categories    │
         │               ├─────────────────┤
         │               │ id              │
         ├───────────────│ name            │
         │               │ parent_id       │───┐
         │               │ is_active       │   │
         │               └─────────────────┘   │
         │                                      │
         │               ┌─────────────────┐   │
         │               │ user_purchase_  │   │
         │               │   categories    │   │
         │               ├─────────────────┤   │
         │               │ id              │   │
         └───────────────│ user_id         │   │
                         │ name            │   │
                         │ parent_id       │───┘
                         │ parent_type     │
                         └─────────────────┘




                         ┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLI STRUCTURE                                      │
│                                                                              │
│  budget-cli/                                                                 │
│  ├── index.js                 # Главный файл, регистрация команд           │
│  ├── package.json                                                           │
│  ├── .env                     # API_URL, конфигурация                       │
│  ├── .budget-config.json       # Сохраненные настройки, токен?              │
│  │                                                                           │
│  ├── commands/                                                              │
│  │   ├── auth.js              # login, logout, register, whoami            │
│  │   ├── wallet.js             # list, create, balance, delete             │
│  │   ├── transaction.js        # add-income, add-expense, history, transfer│
│  │   ├── category.js           # list, add, update, delete                  │
│  │   ├── stats.js              # monthly, daily, categories, export        │
│  │   ├── debt.js               # add, list, pay, status                     │
│  │   └── config.js             # set-server, show-config                    │
│  │                                                                           │
│  ├── services/                                                              │
│  │   ├── api.js                # HTTP клиент (axios) с интерцепторами      │
│  │   ├── auth.js                # Управление токеном, сохранение           │
│  │   ├── config.js              # Чтение/запись конфига                    │
│  │   └── formatter.js           # Форматирование вывода (таблицы, цвета)   │
│  │                                                                           │
│  └── utils/                                                                  │
│      ├── logger.js              # Цветной вывод                            │
│      ├── validators.js          # Валидация ввода                           │
│      └── errors.js              # Обработка ошибок                         │
└─────────────────────────────────────────────────────────────────────────────┘


🐶 Budget Planner CLI
Консольное приложение для управления личным бюджетом с возможностью отслеживания доходов, расходов, кошельков и долгов. Проект построен на клиент-серверной архитектуре с использованием Express и PostgreSQL.

🚀 Возможности
Для зарегистрированного пользователя:
Аутентификация

Регистрация нового аккаунта

Вход в систему

Выход (с одного или всех устройств)

Смена пароля

Управление кошельками

Создание кошелька (наличные, карта, и т.д.)

Просмотр баланса всех кошельков

История изменений баланса

Удаление кошелька

Транзакции

Добавление дохода

Добавление расхода (с категорией)

Перевод между кошельками

История транзакций с фильтрацией

Редактирование/удаление транзакций

Категории

Создание пользовательских категорий

Просмотр системных категорий

Группировка расходов по категориям

Аналитика

Статистика доходов/расходов за период

Дневная статистика

Топ категорий расходов

Экспорт данных в CSV/JSON

Долги и кредиты

Учет долгов (мне должны / я должен)

Учет кредитов

Отслеживание статуса задолженности

🏗 Архитектура проекта
text
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   CLI Client    │────▶│   REST API      │────▶│   PostgreSQL    │
│   (Commander)   │◀────│   (Express)     │◀────│   Database      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
Технологический стек:
Backend:

Node.js + Express

TypeScript

Sequelize 7+ (ORM)

PostgreSQL

JWT для аутентификации

bcrypt для хеширования паролей

CLI Client:

Commander.js (обработка команд)

Axios (HTTP клиент)

Chalk (цветной вывод)

Table (табличный вывод)

Configstore (хранение токена)

📁 Структура проекта
text
budget-planner/
├── server/                    # Backend часть
│   ├── src/
│   │   ├── modules/           # Модули приложения
│   │   │   ├── auth/          # Аутентификация
│   │   │   ├── user/          # Пользователи
│   │   │   ├── wallet/        # Кошельки
│   │   │   ├── transaction/   # Транзакции
│   │   │   └── stats/         # Статистика
│   │   ├── database/          # Работа с БД
│   │   │   ├── models/        # Модели Sequelize
│   │   │   ├── repositories/  # Репозитории
│   │   │   └── di/            # DI контейнер
│   │   └── types/             # TypeScript типы
│   ├── .env                   
│   └── package.json
│
├── cli/                       # CLI клиент
│   ├── commands/              # Команды
│   │   ├── auth.js
│   │   ├── wallet.js
│   │   ├── transaction.js
│   │   └── stats.js
│   ├── services/              # Сервисы клиента
│   │   ├── api.js             # HTTP клиент
│   │   └── auth.js            # Управление токеном
│   ├── utils/                 # Утилиты
│   │   ├── formatter.js       # Форматирование вывода
│   │   └── logger.js          # Цветной вывод
│   ├── index.js                # Главный файл
│   └── package.json
│
└── README.md
💻 Установка и запуск
Backend
bash
# Клонировать репозиторий
git clone https://github.com/yourusername/budget-planner.git
cd budget-planner/server

# Установить зависимости
npm install

# Настроить переменные окружения
cp .env.example .env
# Отредактировать .env (БД, JWT секреты)

# Запустить миграции БД
npm run db:migrate

# Запустить сервер
npm run dev
CLI Client
bash
cd ../cli

# Установить зависимости
npm install

# Линкнуть клиент глобально (опционально)
npm link

# Настроить URL сервера
echo "API_URL=http://localhost:3000" > .env

# Запустить (если не линковали)
node index.js --help
📖 Использование CLI
Аутентификация
bash
# Регистрация
budget auth register --email user@example.com --password secret --name "Иван"

# Вход
budget auth login --email user@example.com --password secret

# Проверка текущего пользователя
budget auth whoami

# Выход
budget auth logout

# Выход со всех устройств
budget auth logout-all
Кошельки
bash
# Создать кошелек
budget wallet create --name "Наличные" --currency RUB

# Список кошельков
budget wallet list

# Баланс конкретного кошелька
budget wallet balance --id 1

# Удалить кошелек
budget wallet delete --id 1
Транзакции
bash
# Добавить доход
budget tx income --wallet 1 --amount 50000 --desc "Зарплата"

# Добавить расход
budget tx expense --wallet 1 --amount 3500 --cat "Продукты" --desc "Ашан"

# Перевод между кошельками
budget tx transfer --from 1 --to 2 --amount 10000

# История транзакций
budget tx history --wallet 1 --limit 10

# История за период
budget tx history --start 2024-01-01 --end 2024-01-31
Статистика
bash
# Статистика за месяц
budget stats --month 2024-01

# Расходы по категориям
budget stats categories --month 2024-01

# Дневная статистика
budget stats daily --month 2024-01

# Экспорт в CSV
budget stats export --month 2024-01 --format csv
Категории
bash
# Список категорий
budget category list

# Создать категорию
budget category add --name "Такси" --parent "Транспорт"

# Удалить категорию
budget category delete --id 5
🗄 Модели данных
Основные модели:
User

id, email, name, password_hash

default_currency

isActive, lastLoginAt

Wallet

id, name, currency

current_balance

user_id (foreign key)

Transaction

id, amount, description

operation_date

type (income/expense/transfer)

wallet_id, category_id

related_tx_id (для переводов)

Category

id, name, parent_id

type (system/user)

🔒 Безопасность
JWT токены (access + refresh)

Refresh токены хранятся в БД

HttpOnly cookies для refresh токена

Хеширование паролей bcrypt

Валидация всех входных данных

Защита от SQL инъекций (Sequelize)

🧪 Тестирование
bash
# Запуск тестов
npm test

# Тесты с покрытием
npm run test:coverage

# E2E тесты
npm run test:e2e
📈 Планы по развитию
Web интерфейс (React)

Мобильное приложение (React Native)

Импорт выписок из банков

Планирование бюджета

Уведомления о превышении лимитов

Мультивалютность

Обмен данными между пользователями

🤝 Вклад в проект
Fork репозитория

Создать ветку для фичи (git checkout -b feature/amazing-feature)

Commit изменения (git commit -m 'Add amazing feature')

Push в ветку (git push origin feature/amazing-feature)

Open Pull Request

📝 Лицензия
MIT

✨ Автор
[Your Name] - [your.email@example.com]

Примечание: Проект создан в образовательных целях для демонстрации навыков разработки на TypeScript, архитектуры клиент-серверных приложений и работы с базами данных.