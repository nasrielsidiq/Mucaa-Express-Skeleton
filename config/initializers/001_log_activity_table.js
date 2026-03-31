import pool from "../db.js";

export const initLogActivityTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS log_activity (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      action_label VARCHAR(255) DEFAULT 'Aktivitas Sistem',
      activity TEXT NOT NULL,
      modul VARCHAR(255) DEFAULT 'Lainnya',
      ip_address VARCHAR(45) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `;

  try {
    await pool.query(createTableQuery);

    // Ensure existing tables are updated with new columns safely
    try { await pool.query("ALTER TABLE log_activity ADD COLUMN action_label VARCHAR(255) DEFAULT 'Aktivitas Sistem'"); } catch (e) { /* column exists */ }
    try { await pool.query("ALTER TABLE log_activity MODIFY COLUMN activity TEXT NOT NULL"); } catch (e) { /* keep going */ }
    try { await pool.query("ALTER TABLE log_activity ADD COLUMN modul VARCHAR(255) DEFAULT 'Lainnya'"); } catch (e) { /* column exists */ }
    try { await pool.query("ALTER TABLE log_activity ADD COLUMN ip_address VARCHAR(45) NULL"); } catch (e) { /* column exists */ }

    console.log("✅ 'log_activity' table initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize 'log_activity' table:", error);
    throw error;
  }
}