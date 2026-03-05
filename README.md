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