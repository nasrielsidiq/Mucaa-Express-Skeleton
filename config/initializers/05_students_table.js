import pool from "../db.js";

export const initStudentsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nip VARCHAR(50) NOT NULL UNIQUE,
      user_id INT NOT NULL,
      group_id INT NOT NULL,
      grade VARCHAR(50) NOT NULL,
      religion VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (group_id) REFERENCES \`groups\`(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `;

  try {
    await pool.query(createTableQuery);
    console.log("✅ 'students' table initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize 'students' table:", error);
    throw error;
  }
}