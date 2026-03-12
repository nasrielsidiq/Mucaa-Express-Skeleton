import pool from "../db.js";

export const initDirectorsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS directors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      nrp VARCHAR(50) NOT NULL UNIQUE,
      position VARCHAR(255) NOT NULL,
      unit VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `;

  try {
    await pool.query(createTableQuery);
    console.log("✅ 'director' table initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize 'director' table:", error);
    throw error;
  }
}