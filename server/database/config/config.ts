import dotenv from "dotenv";
import type { Options } from "sequelize";

dotenv.config();

export interface IDatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: "postgres";
  seederStorage: "sequelize";
  migrationStorage: "sequelize";
  dialectOptions?: {
    ssl?: {
      require: boolean;
      rejectUnauthorized?: boolean;
    };
  };
}

export interface IConfig {
  development: IDatabaseConfig;
  test: IDatabaseConfig;
  production: IDatabaseConfig;
}

const baseConfig = {
  dialect: "postgres" as const,
  seederStorage: "sequelize" as const,
  migrationStorage: "sequelize" as const,
};

export const config: IConfig = {
  development: {
    ...baseConfig,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: process.env.DB_NAME || "BPlanner",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    dialectOptions:
      process.env.DB_SSL === "true"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : undefined,
  },
  test: {
    ...baseConfig,
    username: process.env.TEST_DB_USER || "postgres",
    password: process.env.TEST_DB_PASS || "postgres",
    database: process.env.TEST_DB_NAME || "BPlanner_Test",
    host: process.env.TEST_DB_HOST || "localhost",
    port: parseInt(process.env.TEST_DB_PORT || "5432", 10),
  },
  production: {
    ...baseConfig,
    username: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

export const getConfigForEnvironment = (
  env: string = process.env.NODE_ENV || "development",
): IDatabaseConfig => {
  return config[env as keyof IConfig] || config.development;
};

export const getSequelizeOptions = (env?: string): Options => {
  const dbConfig = getConfigForEnvironment(env);

  return {
    dialect: dbConfig.dialect,
    database: dbConfig.database,
    username: dbConfig.username,
    password: dbConfig.password,
    host: dbConfig.host,
    port: dbConfig.port,
    dialectOptions: dbConfig.dialectOptions,
    pool: {
      min: 0,
      max: 5,
      acquire: 30000,
      idle: 10000,
    },
    logging:
      process.env.NODE_ENV === "development"
        ? (msg: string) => console.log(`📦 ${msg}`)
        : false,
  };
};
