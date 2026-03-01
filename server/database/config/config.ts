import dotenv from 'dotenv';
dotenv.config();

interface IDbConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: 'postgres';
  seederStorage: 'sequelize';
  migrationStorage: 'sequelize';
}

interface IConfig {
  development: IDbConfig;
  test: IDbConfig;
  production: IDbConfig;
}

export const config: IConfig = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'BPlanner',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    seederStorage: 'sequelize',
    migrationStorage: 'sequelize'
  },
  test: {
    username: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASS || 'postgres',
    database: process.env.TEST_DB_NAME || 'BPlanner_Test',
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '5432'),
    dialect: 'postgres',
    seederStorage: 'sequelize',
    migrationStorage: 'sequelize'
  },
  production: {
    username: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    seederStorage: 'sequelize',
    migrationStorage: 'sequelize'
  }
};

