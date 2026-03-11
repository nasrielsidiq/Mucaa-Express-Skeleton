// Run once to create tables and seed data
import { runInitializers } from "./initializers/index.js";
import { runSeeders } from "./seeders/index.js";

export const initDB = async () => {
  try {
    await runInitializers();
    await runSeeders();
    console.log("✨ Database initialization and seeding completed");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
};