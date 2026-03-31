import pool from "../config/db.js";

const Student = {
  // ─── Find ───────────────────────────────────────────────
  async findAll() {
    const [rows] = await pool.query(`
      SELECT s.id, s.nip, s.user_id, s.group_id, s.grade, s.religion, u.is_active,
             u.name, u.email, u.role, 
             g.name as group_name, g.grade as group_grade,
             s.created_at, s.updated_at
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN \`groups\` g ON s.group_id = g.id
      ORDER BY s.created_at DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT s.id, s.nip, s.user_id, s.group_id, s.grade, s.religion, u.is_active,
             u.name, u.email, u.role, 
             g.name as group_name, g.grade as group_grade,
             s.created_at, s.updated_at
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN \`groups\` g ON s.group_id = g.id
      WHERE s.id = ?
    `, [id]);
    return rows[0] || null;
  },

  async findByUserId(userId) {
    const [rows] = await pool.query(`
      SELECT s.id, s.nip, s.user_id, s.group_id, s.grade, s.religion,
             u.name, u.email, u.role, 
             g.name as group_name, g.grade as group_grade,
             s.created_at, s.updated_at
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN \`groups\` g ON s.group_id = g.id
      WHERE s.user_id = ?
    `, [userId]);
    return rows[0] || null;
  },

  async findByNip(nip) {
    const [rows] = await pool.query(`
      SELECT s.id, s.nip, s.user_id, s.group_id, s.grade, s.religion,
             u.name, u.email, u.role, 
             g.name as group_name, g.grade as group_grade,
             s.created_at, s.updated_at
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN \`groups\` g ON s.group_id = g.id
      WHERE s.nip = ?
    `, [nip]);
    return rows[0] || null;
  },

  async findByGroupId(groupId) {
    const [rows] = await pool.query(`
      SELECT s.id, s.nip, s.user_id, s.group_id, s.grade, s.religion,
             u.name, u.email, u.role, 
             g.name as group_name, g.grade as group_grade,
             s.created_at, s.updated_at
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN \`groups\` g ON s.group_id = g.id
      WHERE s.group_id = ?
      ORDER BY u.name ASC
    `, [groupId]);
    return rows;
  },

  // ─── Create ─────────────────────────────────────────────
  async create({ nip, user_id, group_id, grade, religion }) {
    const [result] = await pool.query(
      "INSERT INTO students (nip, user_id, group_id, grade, religion) VALUES (?, ?, ?, ?, ?)",
      [nip, user_id, group_id, grade, religion]
    );
    return this.findById(result.insertId);
  },

  // ─── Update ─────────────────────────────────────────────
  async update(id, fields) {
    const allowed = ["group_id", "grade", "religion"];
    const updates = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => `${k} = ?`);

    if (updates.length === 0) return this.findById(id);

    const values = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => fields[k]);

    await pool.query(
      `UPDATE students SET ${updates.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  },

  // ─── Delete ─────────────────────────────────────────────
  async delete(id) {
    const [result] = await pool.query(
      "DELETE FROM students WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

export default Student;
