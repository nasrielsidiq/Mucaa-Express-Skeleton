import pool from "../config/db.js";

const Group = {
  // ─── Find ───────────────────────────────────────────────
  async findAll() {
    const [rows] = await pool.query(`
      SELECT id, name, grade, created_at, updated_at
      FROM \`groups\`
      ORDER BY grade ASC, name ASC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT id, name, grade, created_at, updated_at
      FROM \`groups\`
      WHERE id = ?
    `, [id]);
    return rows[0] || null;
  },

  async findByName(name) {
    const [rows] = await pool.query(`
      SELECT id, name, grade, created_at, updated_at
      FROM \`groups\`
      WHERE name = ?
    `, [name]);
    return rows[0] || null;
  },

  async findByGrade(grade) {
    const [rows] = await pool.query(`
      SELECT id, name, grade, created_at, updated_at
      FROM \`groups\`
      WHERE grade = ?
      ORDER BY name ASC
    `, [grade]);
    return rows;
  },

  // ─── Create ─────────────────────────────────────────────
  async create({ name, grade }) {
    const [result] = await pool.query(
      "INSERT INTO `groups` (name, grade) VALUES (?, ?)",
      [name, grade]
    );
    return this.findById(result.insertId);
  },

  // ─── Update ─────────────────────────────────────────────
  async update(id, fields) {
    const allowed = ["name", "grade"];
    const updates = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => `${k} = ?`);

    if (updates.length === 0) return this.findById(id);

    const values = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => fields[k]);

    await pool.query(
      `UPDATE \`groups\` SET ${updates.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  },

  // ─── Delete ─────────────────────────────────────────────
  async delete(id) {
    const [result] = await pool.query(
      "DELETE FROM `groups` WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

export default Group;
