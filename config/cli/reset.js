import pool from "../db.js";
import { ConnectDB } from "../db.js";

const tablesToDrop = [
  'users', 
  'directors', 
  'teachers', 
  'groups',
  'students',
  'tasks',
  'gived_tasks',
  'grade_categories',
  'grades',
  'performances',
  'locations',
  'points'
];

const escapedTables = tablesToDrop.map(table => `\`${table}\``).join(', ');
(async () => {
  try {
    await ConnectDB();

    // Drop all tables (be careful with this!)
    console.log("🗑️  Dropping existing tables...");
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");
    await pool.query(`DROP TABLE IF EXISTS ${escapedTables}`);
    await pool.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("✅ All tables dropped successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Reset failed:", error);
    process.exit(1);
  }
})();
