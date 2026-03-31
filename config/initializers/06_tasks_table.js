import pool from "../db.js";

export const initTasksTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      teacher_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      type ENUM('sprint', 'apel') DEFAULT 'sprint',
      is_by_location BOOLEAN DEFAULT FALSE,
      location_id INT NULL,
      start_date DATE,
      due_date DATE,
      start_time TIME,
      due_time TIME,
      status ENUM('active', 'late', 'completed') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
      FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
    ) ENGINE=InnoDB;
  `;

  try {
    await pool.query(createTableQuery);
    console.log("✅ 'tasks' table initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize 'tasks' table:", error);
    throw error;
  }
};