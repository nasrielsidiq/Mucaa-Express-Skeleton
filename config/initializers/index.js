import { initUsersTable } from "./01_users_table.js";

const initializers = [initUsersTable];

export const runInitializers = async () => {
  console.log("📦 Starting database initialization...");
  try {
    for (const initializer of initializers) {
      await initializer();
    }
    console.log("✨ All initializers completed successfully");
  } catch (error) {
    console.error("❌ Initialization failed:", error);
    throw error;
  }
};
