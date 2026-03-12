import pool from "../config/db.js";

const Teacher = {
  // ─── Find ───────────────────────────────────────────────
  async findAll() {
    const [rows] = await pool.query(`
      SELECT t.id, t.user_id, t.nrp, t.rank, t.position, 
             u.name, u.email, u.role, t.created_at, t.updated_at
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT t.id, t.user_id, t.nrp, t.rank, t.position, 
             u.name, u.email, u.role, t.created_at, t.updated_at
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `, [id]);
    return rows[0] || null;
  },

  async findByUserId(userId) {
    const [rows] = await pool.query(`
      SELECT t.id, t.user_id, t.nrp, t.rank, t.position, 
             u.name, u.email, u.role, t.created_at, t.updated_at
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE t.user_id = ?
    `, [userId]);
    return rows[0] || null;
  },

  async findByNrp(nrp) {
    const [rows] = await pool.query(`
      SELECT t.id, t.user_id, t.nrp, t.rank, t.position, 
             u.name, u.email, u.role, t.created_at, t.updated_at
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE t.nrp = ?
    `, [nrp]);
    return rows[0] || null;
  },

  // ─── Create ─────────────────────────────────────────────
  async create({ user_id, nrp, rank, position }) {
    const [result] = await pool.query(
      "INSERT INTO teachers (user_id, nrp, rank, position) VALUES (?, ?, ?, ?)",
      [user_id, nrp, rank, position]
    );
    return this.findById(result.insertId);
  },

  // ─── Update ─────────────────────────────────────────────
  async update(id, fields) {
    const allowed = ["rank", "position"];
    const updates = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => `${k} = ?`);

    if (updates.length === 0) return this.findById(id);

    const values = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => fields[k]);

    await pool.query(
      `UPDATE teachers SET ${updates.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  },

  // ─── Delete ─────────────────────────────────────────────
  async delete(id) {
    const [result] = await pool.query(
      "DELETE FROM teachers WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

export default Teacher;
