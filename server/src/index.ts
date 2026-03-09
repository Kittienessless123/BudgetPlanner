import server from "./server.ts";
import { initDb } from "../database/config/index.ts";
import { LoggerService } from "../logs/logger.service.ts";

const PORT = process.env.PORT || 5000;
const logger = new LoggerService("APP");

(async () => {
  try {
    await initDb();
    const app = server.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
    });

    const shutdown = () => {
      logger.info("Shutting down...");
      app.close(() => process.exit(0));
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (err) {
    logger.error("Startup error:", err);
    process.exit(1);
  }
})();
