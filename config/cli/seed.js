import { runSeeders } from "../seeders/index.js";
import { ConnectDB } from "../db.js";

(async () => {
  try {
    await ConnectDB();
    await runSeeders();
    console.log("✅ Database seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
})();
