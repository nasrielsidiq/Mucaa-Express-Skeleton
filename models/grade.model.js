import pool from "../config/db.js";

const Grade = {
  // ─── Find ───────────────────────────────────────────────
  async findAll() {
    const [rows] = await pool.query(`
      SELECT g.id, g.student_id, g.teacher_id, g.grade_category_id, 
             g.grade, g.created_at, g.updated_at,
             s.nip as student_nip, u.name as student_name,
             t.nrp as teacher_nrp, tu.name as teacher_name,
             gc.name as category_name
      FROM grades g
      JOIN students s ON g.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN teachers t ON g.teacher_id = t.id
      JOIN users tu ON t.user_id = tu.id
      LEFT JOIN grade_categories gc ON g.grade_category_id = gc.id
      ORDER BY g.created_at DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT g.id, g.student_id, g.teacher_id, g.grade_category_id, 
             g.grade, g.created_at, g.updated_at,
             s.nip as student_nip, u.name as student_name,
             t.nrp as teacher_nrp, tu.name as teacher_name,
             gc.name as category_name
      FROM grades g
      JOIN students s ON g.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN teachers t ON g.teacher_id = t.id
      JOIN users tu ON t.user_id = tu.id
      LEFT JOIN grade_categories gc ON g.grade_category_id = gc.id
      WHERE g.id = ?
    `, [id]);
    return rows[0] || null;
  },

  async findByStudentId(studentId) {
    const [rows] = await pool.query(`
      SELECT g.id, g.student_id, g.teacher_id, g.grade_category_id, 
             g.grade, g.created_at, g.updated_at,
             s.nip as student_nip, u.name as student_name,
             t.nrp as teacher_nrp, tu.name as teacher_name,
             gc.name as category_name
      FROM grades g
      JOIN students s ON g.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN teachers t ON g.teacher_id = t.id
      JOIN users tu ON t.user_id = tu.id
      LEFT JOIN grade_categories gc ON g.grade_category_id = gc.id
      WHERE g.student_id = ?
      ORDER BY g.created_at DESC
    `, [studentId]);
    return rows;
  },

  async findByTeacherId(teacherId) {
    const [rows] = await pool.query(`
      SELECT g.id, g.student_id, g.teacher_id, g.grade_category_id, 
             g.grade, g.created_at, g.updated_at,
             s.nip as student_nip, u.name as student_name,
             t.nrp as teacher_nrp, tu.name as teacher_name,
             gc.name as category_name
      FROM grades g
      JOIN students s ON g.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN teachers t ON g.teacher_id = t.id
      JOIN users tu ON t.user_id = tu.id
      LEFT JOIN grade_categories gc ON g.grade_category_id = gc.id
      WHERE g.teacher_id = ?
      ORDER BY g.created_at DESC
    `, [teacherId]);
    return rows;
  },

  // ─── Create ─────────────────────────────────────────────
  async create({ student_id, teacher_id, grade_category_id, grade }) {
    const [result] = await pool.query(
      "INSERT INTO grades (student_id, teacher_id, grade_category_id, grade) VALUES (?, ?, ?, ?)",
      [student_id, teacher_id, grade_category_id, grade]
    );
    return this.findById(result.insertId);
  },

  // ─── Update ─────────────────────────────────────────────
  async update(id, fields) {
    const allowed = ["grade_category_id", "grade"];
    const updates = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => `${k} = ?`);

    if (updates.length === 0) return this.findById(id);

    const values = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => fields[k]);

    await pool.query(
      `UPDATE grades SET ${updates.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  },

  // ─── Delete ─────────────────────────────────────────────
  async delete(id) {
    const [result] = await pool.query(
      "DELETE FROM grades WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

export default Grade;
