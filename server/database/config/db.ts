import { Sequelize, type Options } from "sequelize";
import dotenv from "dotenv";

import { setupConnections } from "../models/connections.ts";
import { User } from "../models/user.model.ts";
import { Wallet } from "../models/wallet.model.ts";

dotenv.config();

let db: Sequelize | null = null;

interface DbConfig {
  database: string;
  username: string;
  password: string;
  host: string;
  port: number;
}

const getDbConfig = (): DbConfig => {
  const { DB_DATABASENAME, DB_NAME, DB_PASSWORD, DB_HOST, DB_PORT } =
    process.env;

  if (!DB_DATABASENAME || !DB_NAME || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
    throw new Error("Missing required database environment variables");
  }

  return {
    database: DB_DATABASENAME,
    username: DB_NAME,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: parseInt(DB_PORT, 10),
  };
};

export const initDb = async (): Promise<Sequelize> => {
  if (db) {
    return db;
  }

  const config = getDbConfig();

  const sequelizeOptions: Options = {
    dialect: "postgres",
    database: config.database,
    username: config.username,
    password: config.password,
    host: config.host,
    port: config.port,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // для некоторых хостингов
      },
    },
    pool: {
      min: 0,
      max: 5,
      acquire: 30000,
      idle: 10000,
    },
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  };

  db = new Sequelize(sequelizeOptions);
  models: [User, Wallet];
  try {
    // Инициализация моделей

    // Настройка связей
    setupConnections(db);

    // Синхронизация (в dev режиме)
    if (process.env.NODE_ENV === "development") {
      await db.sync({ alter: true });
    } else {
      await db.sync();
    }

    console.log("✅ Database connected and synced");

    return db;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
};

export const getDb = (): Sequelize => {
  if (!db) {
    throw new Error("Database not initialized. Call initDb first.");
  }
  return db;
};

// Для удобства можно экспортировать и сам Sequelize
export default db;
