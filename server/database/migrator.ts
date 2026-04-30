import { Umzug, SequelizeStorage } from 'umzug';
import { Sequelize } from '@sequelize/core';
import path from 'path';
import { fileURLToPath } from 'url';
import { getSequelizeOptions } from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Migrator {
  private umzug: Umzug | null = null;
  private sequelize: Sequelize | null = null;

  /**
   * Создает подключение к БД и инициализирует мигратор
   */
  async init() {
    const options = getSequelizeOptions();
    this.sequelize = new Sequelize(options);

    await this.sequelize.authenticate();
    console.log('✅ [Migrator] Database connected');

    this.umzug = new Umzug({
      migrations: {
        glob: path.join(__dirname, 'migrations/*.ts'),
        resolve: (params) => {
          const migration = require(params.path);
          return {
            name: params.name,
            up: async () => migration.up(params.context),
            down: async () => migration.down(params.context),
          };
        },
      },
      context: this.sequelize.getQueryInterface(),
      storage: new SequelizeStorage({
        sequelize: this.sequelize,
        modelName: 'SequelizeMeta'
      }),
      logger: console,
    });

    return this;
  }

  /**
   * Запускает все pending миграции
   */
  async up() {
    if (!this.umzug) throw new Error('Migrator not initialized');
    
    console.log('🔄 Running migrations...');
    const migrations = await this.umzug.up();
    
    if (migrations.length === 0) {
      console.log('✅ No pending migrations');
    } else {
      console.log(`✅ Executed migrations: ${migrations.map(m => m.name).join(', ')}`);
    }
    
    return migrations;
  }

  /**
   * Откатывает последнюю миграцию
   */
  async down() {
    if (!this.umzug) throw new Error('Migrator not initialized');
    
    const migration = await this.umzug.down();
    console.log(`✅ Reverted migration: ${migration?.name}`);
    return migration;
  }

  /**
   * Откатывает все миграции
   */
  async downAll() {
    if (!this.umzug) throw new Error('Migrator not initialized');
    
    const migrations = await this.umzug.down({ to: 0 });
    console.log(`✅ Reverted ${migrations.length} migrations`);
    return migrations;
  }

  /**
   * Запускает сиды
   */
  async seed(seedersPath: string = path.join(__dirname, 'seeders/*.ts')) {
    if (!this.sequelize) throw new Error('Database not connected');

    const seeder = new Umzug({
      migrations: {
        glob: seedersPath,
        resolve: (params) => {
          const seeder = require(params.path);
          return {
            name: params.name,
            up: async () => seeder.up(params.context),
            down: async () => seeder.down(params.context),
          };
        },
      },
      context: this.sequelize.getQueryInterface(),
      storage: new SequelizeStorage({
        sequelize: this.sequelize,
        modelName: 'SequelizeData'
      }),
      logger: console,
    });

    console.log('🌱 Running seeds...');
    const seeds = await seeder.up();
    console.log(`✅ Executed ${seeds.length} seeds`);
    return seeds;
  }

  /**
   * Возвращает инстанс Sequelize (для использования в приложении)
   */
  getSequelize() {
    return this.sequelize;
  }

  /**
   * Закрывает соединение с БД
   */
  async close() {
    if (this.sequelize) {
      await this.sequelize.close();
      console.log('🔌 [Migrator] Database connection closed');
    }
  }
}

// Создаем и экспортируем singleton
export const migrator = new Migrator();