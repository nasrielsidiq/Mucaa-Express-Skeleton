import pool from "../config/db.js";

const GradeCategory = {
  // ─── Find ───────────────────────────────────────────────
  async findAll() {
    const [rows] = await pool.query(`
      SELECT id, name, value, description, category_id, created_at, updated_at
      FROM grade_categories
      ORDER BY name ASC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT id, name, value, description, category_id, created_at, updated_at
      FROM grade_categories
      WHERE id = ?
    `, [id]);
    return rows[0] || null;
  },

  async findByName(name) {
    const [rows] = await pool.query(`
      SELECT id, name, value, description, category_id, created_at, updated_at
      FROM grade_categories
      WHERE name = ?
    `, [name]);
    return rows[0] || null;
  },

  async findParents() {
    const [rows] = await pool.query(`
      SELECT id, name, value, description, category_id, created_at, updated_at
      FROM grade_categories
      WHERE category_id IS NULL
      ORDER BY name ASC
    `);
    return rows;
  },

  async findChildren(categoryId) {
    const [rows] = await pool.query(`
      SELECT id, name, value, description, category_id, created_at, updated_at
      FROM grade_categories
      WHERE category_id = ?
      ORDER BY name ASC
    `, [categoryId]);
    return rows;
  },

  // ─── Create ─────────────────────────────────────────────
  async create({ name, value = 1, description = null, category_id = null }) {
    const [result] = await pool.query(
      "INSERT INTO grade_categories (name, value, description, category_id) VALUES (?, ?, ?, ?)",
      [name, value, description, category_id]
    );
    return this.findById(result.insertId);
  },

  // ─── Update ─────────────────────────────────────────────
  async update(id, fields) {
    const allowed = ["name", "value", "description", "category_id"];
    const updates = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => `${k} = ?`);

    if (updates.length === 0) return this.findById(id);

    const values = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => fields[k]);

    await pool.query(
      `UPDATE grade_categories SET ${updates.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  },

  // ─── Delete ─────────────────────────────────────────────
  async delete(id) {
    const [result] = await pool.query(
      "DELETE FROM grade_categories WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

export default GradeCategory;
