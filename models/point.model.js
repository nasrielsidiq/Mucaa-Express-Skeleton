import pool from "../config/db.js";

const Point = {
  // ─── Find ───────────────────────────────────────────────
  async findAll() {
    const [rows] = await pool.query(`
      SELECT * FROM points
      ORDER BY created_at DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT * FROM points
      WHERE id = ?
    `, [id]);
    return rows[0] || null;
  },

  async findByCategory(category) {
    const [rows] = await pool.query(`
      SELECT * FROM points
      WHERE category = ?
      ORDER BY created_at DESC
    `, [category]);
    return rows;
  },

  // ─── Create ─────────────────────────────────────────────
  async create({ name, category, points, description }) {
    const [result] = await pool.query(
      "INSERT INTO points (name, category, points, description) VALUES (?, ?, ?, ?)",
      [name, category, points, description]
    );
    return this.findById(result.insertId);
  },

  // ─── Update ─────────────────────────────────────────────
  async update(id, fields) {
    const allowed = ["name", "category", "points", "description"];
    const updates = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => `${k} = ?`);

    if (updates.length === 0) return this.findById(id);

    const values = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => fields[k]);

    await pool.query(
      `UPDATE points SET ${updates.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  },

  // ─── Delete ─────────────────────────────────────────────
  async delete(id) {
    const [result] = await pool.query(
      "DELETE FROM points WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

export default Point;
