import { seedAdmins } from "./01_admin_seeder.js";
import { seedGroups } from "./02_groups_seeder.js";
import { seedDirectors } from "./03_directors_seeder.js";
import { seedTeachers } from "./04_teachers_seeder.js";
import { seedStudents } from "./05_students_seeder.js";

const seeders = [seedAdmins, seedGroups, seedDirectors, seedTeachers, seedStudents];

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
