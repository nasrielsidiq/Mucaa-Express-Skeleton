import pool from "../db.js";

export const initGradeCategoriesTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS grade_categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      category_id INT NULL,
      FOREIGN KEY (category_id) REFERENCES grade_categories(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `;

    try {
        await pool.query(createTableQuery);
        console.log("✅ 'grade_categories' table initialized successfully");
    } catch (error) {
        console.error("❌ Failed to initialize 'grade_categories' table:", error);
        throw error;
    }
};