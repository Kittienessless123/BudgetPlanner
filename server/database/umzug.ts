import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createMigrator = (sequelize: Sequelize) => {
  return new Umzug({
    migrations: {
      glob: path.join(__dirname, 'migrations/*.ts'),
      resolve: (params) => {
        const migration = require(params.path!);
        return {
          name: params.name,
          up: async () => migration.up(params.context, Sequelize),
          down: async () => migration.down(params.context, Sequelize),
        };
      },
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ 
      sequelize,
      modelName: 'SequelizeMeta'  // таблица для отслеживания миграций
    }),
    logger: console,
  });
};