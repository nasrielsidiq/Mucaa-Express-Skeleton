import { seedAdmins } from "./01_admin_seeder.js";
import { seedDirectors } from "./02_directors_seeder.js";
import { seedTeachers } from "./03_teachers_seeder.js";
import { seedGroups } from "./04_groups_seeder.js";
import { seedStudents } from "./05_students_seeder.js";
import { seedGradeCategories } from "./06_grade_categories_seeder.js";
import { seedGrades } from "./07_grades_seeder.js";
import { seedTasks } from "./08_tasks_seeder.js";
import { seedLocations } from "./10_locations_seeder.js";
import { seedPoints } from "./09_points_seeder.js";
import { seedPerformances } from "./11_performances_seeder.js";

const seeders = [
  seedAdmins,
  seedDirectors,
  seedTeachers,
  seedGroups,
  seedStudents,
  seedGradeCategories,
  seedGrades,
  seedLocations,
  seedTasks,
  seedPoints,
  seedPerformances
];

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
