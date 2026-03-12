import pool from "../db.js";

export const initLogActivityTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS log_activity (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      activity VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `;

  try {
    await pool.query(createTableQuery);
    console.log("✅ 'log_activity' table initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize 'log_activity' table:", error);
    throw error;
  }
}