import pool from "../config/db.js";

const Director = {
  // ─── Find ───────────────────────────────────────────────
  async findAll() {
    const [rows] = await pool.query(`
      SELECT d.id, d.user_id, d.nrp, d.position, d.unit, 
             u.name, u.email, u.role, d.created_at, d.updated_at
      FROM directors d
      JOIN users u ON d.user_id = u.id
      ORDER BY d.created_at DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT d.id, d.user_id, d.nrp, d.position, d.unit, 
             u.name, u.email, u.role, d.created_at, d.updated_at
      FROM directors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ?
    `, [id]);
    return rows[0] || null;
  },

  async findByUserId(userId) {
    const [rows] = await pool.query(`
      SELECT d.id, d.user_id, d.nrp, d.position, d.unit, 
             u.name, u.email, u.role, d.created_at, d.updated_at
      FROM directors d
      JOIN users u ON d.user_id = u.id
      WHERE d.user_id = ?
    `, [userId]);
    return rows[0] || null;
  },

  async findByNrp(nrp) {
    const [rows] = await pool.query(`
      SELECT d.id, d.user_id, d.nrp, d.position, d.unit, 
             u.name, u.email, u.role, d.created_at, d.updated_at
      FROM directors d
      JOIN users u ON d.user_id = u.id
      WHERE d.nrp = ?
    `, [nrp]);
    return rows[0] || null;
  },

  // ─── Create ─────────────────────────────────────────────
  async create({ user_id, nrp, position, unit }) {
    const [result] = await pool.query(
      "INSERT INTO directors (user_id, nrp, position, unit) VALUES (?, ?, ?, ?)",
      [user_id, nrp, position, unit]
    );
    return this.findById(result.insertId);
  },

  // ─── Update ─────────────────────────────────────────────
  async update(id, fields) {
    const allowed = ["position", "unit"];
    const updates = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => `${k} = ?`);

    if (updates.length === 0) return this.findById(id);

    const values = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => fields[k]);

    await pool.query(
      `UPDATE directors SET ${updates.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  },

  // ─── Delete ─────────────────────────────────────────────
  async delete(id) {
    const [result] = await pool.query(
      "DELETE FROM directors WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

export default Director;
