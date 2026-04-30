import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import { createMigrator } from "../database/umzug.js";

const command = process.argv[2]; // 'up' или 'down'

async function run() {
  const sequelize = new Sequelize({
    dialect: PostgresDialect,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
  });

  try {
    await sequelize.authenticate();
    console.log("✅ Connected to database");

    const migrator = createMigrator(sequelize);

    if (command === "up") {
      const migrations = await migrator.up();
      console.log(`✅ Executed ${migrations.length} migrations`);
    } else if (command === "down") {
      const migration = await migrator.down();
      console.log(`✅ Reverted migration: `);
    }

    await sequelize.close();
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

run();
