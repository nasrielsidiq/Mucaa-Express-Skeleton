import pool from "../db.js";

export const initPointsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS points (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category ENUM('Prestasi', 'Pelanggaran') NOT NULL,
      points INT NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `;

  try {
    await pool.query(createTableQuery);
    console.log("✅ 'points' table initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize 'points' table:", error);
    throw error;
  }
};
