import pool from "../db.js";

export const initLocationsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS locations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      icon VARCHAR(50) DEFAULT 'location_on',
      latitude DECIMAL(10, 8) NULL,
      longitude DECIMAL(11, 8) NULL,
      radius INT DEFAULT 0,
      status ENUM('AKTIF', 'TERSEDIA', 'RENOVASI') DEFAULT 'AKTIF',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `;

  try {
    await pool.query(createTableQuery);
    console.log("✅ 'locations' table initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize 'locations' table:", error);
    throw error;
  }
};
