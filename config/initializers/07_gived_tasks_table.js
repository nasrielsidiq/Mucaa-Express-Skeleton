import pool from "../db.js";

export const initGivedTasksTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS gived_tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      task_id INT NOT NULL,
      student_id INT NOT NULL,
      filepath VARCHAR(255),
      rates FLOAT,
      status ENUM('pending', 'completed') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `;

  try {
    await pool.query(createTableQuery);
    console.log("✅ 'gived_tasks' table initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize 'gived_tasks' table:", error);
    throw error;
  }
};