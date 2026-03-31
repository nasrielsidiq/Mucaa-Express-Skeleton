import pool from "../db.js";

export const initGroupsTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS \`groups\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      grade VARCHAR(50) NOT NULL,
      mentor_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (mentor_id) REFERENCES teachers(id) ON DELETE SET NULL
    ) ENGINE=InnoDB;
  `;

  try {
    await pool.query(createTableQuery);
    console.log("✅ 'groups' table initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize 'groups' table:", error);
    throw error;
  }
};