// index-minimal.ts
import server from "./src/server-minimal.ts";

import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import { createMigrator } from './database/umzug.js';


const PORT = process.env.PORT || 3000;

console.log("🟡 Перед server.listen");
try {
  const app = server.listen(PORT, () => {
    console.log("🟢 Колбэк listen вызван");
  });
  console.log("🟢 После server.listen");
} catch (listenError) {
  console.error("🔴 server.listen упал:", listenError);
}