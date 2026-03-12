import pool from "../db.js";

export const initTeachersTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS teachers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      nrp VARCHAR(50) NOT NULL UNIQUE,
      \`rank\` VARCHAR(255) NOT NULL,
      \`position\` VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `;

  try {
    await pool.query(createTableQuery);
    console.log("✅ 'teacher' table initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize 'teacher' table:", error);
    throw error;
  }
}