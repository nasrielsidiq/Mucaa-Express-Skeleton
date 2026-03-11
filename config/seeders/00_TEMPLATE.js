import pool from "../db.js";

/**
 * Template for creating new seeders
 * Copy this file and rename it with a sequential number (02_seeder_name.js, 03_seeder_name.js, etc.)
 * Then add the exported function to the seeders array in index.js
 */

export const seedTemplate = async () => {
  try {
    // Check if data already exists
    const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM template_table");
    
    if (count > 0) {
      console.log("⏭️  Template table already seeded, skipping...");
      return;
    }

    const data = [
      { name: "Sample 1" },
      { name: "Sample 2" },
    ];

    for (const item of data) {
      await pool.query(
        "INSERT INTO template_table (name) VALUES (?)",
        [item.name]
      );
    }

    console.log("✅ Template data seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding template data:", error.message);
    throw error;
  }
};
