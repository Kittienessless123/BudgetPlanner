
import { migrator } from './migrator.js';
import { getSequelizeOptions } from './config/config.js';
import  {initializeModels, } from './config/index.ts';

export class Database {
  private static instance: Database;
  private migrator = migrator;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Инициализирует БД: подключается, выполняет миграции, инициализирует модели
   */
  async initialize(options?: { runMigrations?: boolean; runSeeds?: boolean }) {
    const config = {
      runMigrations: true,
      runSeeds: process.env.NODE_ENV === 'development',
      ...options
    };

    console.log('🚀 Initializing database...');

    // 1. Подключаемся и выполняем миграции
    await this.migrator.init();
    
    if (config.runMigrations) {
      await this.migrator.up();
    }

    if (config.runSeeds) {
      await this.migrator.seed();
    }

    // 2. Инициализируем модели
    const sequelize = this.migrator.getSequelize();
    if (!sequelize) throw new Error('Sequelize not initialized');

    initializeModels(sequelize);
    setupConnections();

    // 3. В development синхронизируем (осторожно!)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('📦 Models synced with alter');
    }

    console.log('✅ Database initialization complete');
    return sequelize;
  }

  /**
   * Возвращает инстанс Sequelize для использования в приложении
   */
  getSequelize() {
    return this.migrator.getSequelize();
  }

  /**
   * Закрывает соединение с БД
   */
  async close() {
    await this.migrator.close();
  }
}

export const db = Database.getInstance();