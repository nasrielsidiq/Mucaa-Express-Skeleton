import { seedUsers } from "./01_users_seeder.js";

const seeders = [seedUsers];

export const runSeeders = async () => {
  console.log("🌱 Starting database seeding...");
  try {
    for (const seeder of seeders) {
      await seeder();
    }
    console.log("✨ All seeders completed successfully");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
};
