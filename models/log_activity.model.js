import pool from "../config/db.js";

const LogActivity = {
  // ─── Find ───────────────────────────────────────────────
  async findAll() {
    const [rows] = await pool.query(`
      SELECT la.id, la.user_id, la.activity, la.created_at,
             u.name, u.email, u.role
      FROM log_activity la
      JOIN users u ON la.user_id = u.id
      ORDER BY la.created_at DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT la.id, la.user_id, la.activity, la.created_at,
             u.name, u.email, u.role
      FROM log_activity la
      JOIN users u ON la.user_id = u.id
      WHERE la.id = ?
    `, [id]);
    return rows[0] || null;
  },

  async findByUserId(userId) {
    const [rows] = await pool.query(`
      SELECT la.id, la.user_id, la.activity, la.created_at,
             u.name, u.email, u.role
      FROM log_activity la
      JOIN users u ON la.user_id = u.id
      WHERE la.user_id = ?
      ORDER BY la.created_at DESC
    `, [userId]);
    return rows;
  },

  async findRecent(limit = 50) {
    const [rows] = await pool.query(`
      SELECT la.id, la.user_id, la.activity, la.created_at,
             u.name, u.email, u.role
      FROM log_activity la
      JOIN users u ON la.user_id = u.id
      ORDER BY la.created_at DESC
      LIMIT ?
    `, [limit]);
    return rows;
  },

  async findByDateRange(startDate, endDate) {
    const [rows] = await pool.query(`
      SELECT la.id, la.user_id, la.activity, la.created_at,
             u.name, u.email, u.role
      FROM log_activity la
      JOIN users u ON la.user_id = u.id
      WHERE la.created_at BETWEEN ? AND ?
      ORDER BY la.created_at DESC
    `, [startDate, endDate]);
    return rows;
  },

  // ─── Create ─────────────────────────────────────────────
  async create({ user_id, activity }) {
    const [result] = await pool.query(
      "INSERT INTO log_activity (user_id, activity) VALUES (?, ?)",
      [user_id, activity]
    );
    return this.findById(result.insertId);
  },

  // ─── Delete (old logs) ───────────────────────────────────
  async deleteOlderThan(days = 90) {
    const [result] = await pool.query(
      "DELETE FROM log_activity WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)",
      [days]
    );
    return result.affectedRows;
  },

  async deleteByUserId(userId) {
    const [result] = await pool.query(
      "DELETE FROM log_activity WHERE user_id = ?",
      [userId]
    );
    return result.affectedRows > 0;
  },
};

export default LogActivity;
