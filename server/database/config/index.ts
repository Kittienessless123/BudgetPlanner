// db/index.ts
import { Sequelize } from "sequelize";
import { getSequelizeOptions } from "../config/config.ts";
import { setupConnections } from "../models/connections.ts";
import * as models from "../models/index.ts"; 

let sequelizeInstance: Sequelize | null = null;

const initializeModels = (sequelize: Sequelize): void => {
  Object.values(models).forEach((model: any) => {
    if (model.initialize && typeof model.initialize === "function") {
      model.initialize(sequelize);
    }
  });

  console.log(`📦 Initialized ${Object.keys(models).length} models`);
};

export const initDb = async (): Promise<Sequelize> => {
  if (sequelizeInstance) {
    return sequelizeInstance;
  }

  try {
    const options = getSequelizeOptions();
    sequelizeInstance = new Sequelize(options);

    await sequelizeInstance.authenticate();
    console.log("✅ Database connection established");

    initializeModels(sequelizeInstance);
    setupConnections();

    if (process.env.NODE_ENV === "development") {
      await sequelizeInstance.sync({ alter: true });
      console.log("📦 Database synced with alter");
    } else if (process.env.NODE_ENV === "test") {
      await sequelizeInstance.sync({ force: true });
      console.log("📦 Database synced with force");
    } else {
      console.log("📦 Production mode - verification only");
      await sequelizeInstance.sync();
    }

    return sequelizeInstance;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
};

export const getDb = (): Sequelize => {
  if (!sequelizeInstance) {
    throw new Error("Database not initialized. Call initDb() first.");
  }
  return sequelizeInstance;
};

export const closeDb = async (): Promise<void> => {
  if (sequelizeInstance) {
    await sequelizeInstance.close();
    sequelizeInstance = null;
    console.log("🔌 Database connection closed");
  }
};


export default sequelizeInstance;
