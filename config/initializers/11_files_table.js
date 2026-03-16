import pool from "../db.js";

export const initFilesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS files (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        filename       VARCHAR(255)        NOT NULL,
        original_name  VARCHAR(255)        NOT NULL,
        mimetype       VARCHAR(100)        NOT NULL,
        size           BIGINT              NOT NULL,
        file_path      VARCHAR(500)        NOT NULL UNIQUE,
        file_url       VARCHAR(500)        NOT NULL,
        file_type      ENUM('profile', 'image', 'task', 'document') DEFAULT 'image',
        is_active      TINYINT(1)          DEFAULT 1,
        created_at     TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
        updated_at     TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Files table initialized");
  } catch (error) {
    console.error("❌ Error initializing files table:", error.message);
    throw error;
  }
};
