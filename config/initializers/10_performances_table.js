import pool from "../db.js";



export const initPerformancesTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS performances (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      teacher_id INT NOT NULL,
      task_id INT NOT NULL,
      grade_category_id INT NULL,
      value FLOAT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (grade_category_id) REFERENCES grade_categories(id) ON DELETE SET NULL
    ) ENGINE=InnoDB;
  `;    
    try {
        await pool.query(createTableQuery);
        console.log("✅ Performances table initialized successfully");
    } catch (error) {
        console.error("❌ Error initializing performances table:", error.message);
        throw error;
    }
};