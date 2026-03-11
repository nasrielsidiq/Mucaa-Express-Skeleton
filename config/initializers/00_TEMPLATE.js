import pool from "../db.js";

/**
 * Template for creating new table initializers
 * Copy this file and rename it with a sequential number (02_table_name.js, 03_table_name.js, etc.)
 * Then add the exported function to the initializers array in index.js
 */

export const initTemplateTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS template_table (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(100)        NOT NULL,
        created_at TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Template table initialized");
  } catch (error) {
    console.error("❌ Error initializing template table:", error.message);
    throw error;
  }
};
