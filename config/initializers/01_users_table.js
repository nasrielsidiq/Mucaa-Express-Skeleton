import pool from "../db.js";

export const initUsersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(100)        NOT NULL,
        email      VARCHAR(150)        NOT NULL UNIQUE,
        password   VARCHAR(255)        NOT NULL,
        role       ENUM('students','admin','teacher','director') DEFAULT 'students',
        phone_number VARCHAR(20)         NULL,
        file_id    INT                 NULL,
        address    TEXT                NULL,
        birth_date DATE                NULL,
        is_active  TINYINT(1)          DEFAULT 1,
        created_at TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL
      )
    `);
    console.log("✅ Users table initialized");
  } catch (error) {
    console.error("❌ Error initializing users table:", error.message);
    throw error;
  }
};
