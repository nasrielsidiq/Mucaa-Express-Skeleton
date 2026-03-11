import { runInitializers } from "../initializers/index.js";
import { ConnectDB } from "../db.js";

(async () => {
  try {
    await ConnectDB();
    await runInitializers();
    console.log("✅ Database initialization completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Initialization failed:", error);
    process.exit(1);
  }
})();
