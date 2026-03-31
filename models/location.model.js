import pool from "../config/db.js";

const Location = {
  // ─── Find ───────────────────────────────────────────────
  async findAll() {
    const [rows] = await pool.query(`
      SELECT * FROM locations
      ORDER BY created_at DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT * FROM locations
      WHERE id = ?
    `, [id]);
    return rows[0] || null;
  },

  // ─── Create ─────────────────────────────────────────────
  async create({ name, icon, latitude, longitude, radius, status }) {
    const [result] = await pool.query(
      "INSERT INTO locations (name, icon, latitude, longitude, radius, status) VALUES (?, ?, ?, ?, ?, ?)",
      [name, icon, latitude, longitude, radius, status || 'AKTIF']
    );
    return this.findById(result.insertId);
  },

  // ─── Update ─────────────────────────────────────────────
  async update(id, fields) {
    const allowed = ["name", "icon", "latitude", "longitude", "radius", "status"];
    const updates = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => `${k} = ?`);

    if (updates.length === 0) return this.findById(id);

    const values = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => fields[k]);

    await pool.query(
      `UPDATE locations SET ${updates.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  },

  // ─── Delete ─────────────────────────────────────────────
  async delete(id) {
    const [result] = await pool.query(
      "DELETE FROM locations WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

export default Location;
