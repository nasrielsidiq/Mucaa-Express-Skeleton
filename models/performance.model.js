import pool from "../config/db.js";

const Performance = {
  // ─── Find ───────────────────────────────────────────────
  async findAll() {
    const [rows] = await pool.query(`
      SELECT p.id, p.student_id, p.teacher_id, p.task_id, p.grade_category_id,
             p.grade, p.created_at, p.updated_at,
             s.nip as student_nip, u.name as student_name,
             t.nrp as teacher_nrp, tu.name as teacher_name,
             ta.title as task_title, ta.type as task_type,
             gc.name as category_name
      FROM performances p
      JOIN students s ON p.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN teachers t ON p.teacher_id = t.id
      JOIN users tu ON t.user_id = tu.id
      JOIN tasks ta ON p.task_id = ta.id
      LEFT JOIN grade_categories gc ON p.grade_category_id = gc.id
      ORDER BY p.created_at DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT p.id, p.student_id, p.teacher_id, p.task_id, p.grade_category_id,
             p.grade, p.created_at, p.updated_at,
             s.nip as student_nip, u.name as student_name,
             t.nrp as teacher_nrp, tu.name as teacher_name,
             ta.title as task_title, ta.type as task_type,
             gc.name as category_name
      FROM performances p
      JOIN students s ON p.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN teachers t ON p.teacher_id = t.id
      JOIN users tu ON t.user_id = tu.id
      JOIN tasks ta ON p.task_id = ta.id
      LEFT JOIN grade_categories gc ON p.grade_category_id = gc.id
      WHERE p.id = ?
    `, [id]);
    return rows[0] || null;
  },

  async findByStudentId(studentId) {
    const [rows] = await pool.query(`
      SELECT p.id, p.student_id, p.teacher_id, p.task_id, p.grade_category_id,
             p.grade, p.created_at, p.updated_at,
             s.nip as student_nip, u.name as student_name,
             t.nrp as teacher_nrp, tu.name as teacher_name,
             ta.title as task_title, ta.type as task_type,
             gc.name as category_name
      FROM performances p
      JOIN students s ON p.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN teachers t ON p.teacher_id = t.id
      JOIN users tu ON t.user_id = tu.id
      JOIN tasks ta ON p.task_id = ta.id
      LEFT JOIN grade_categories gc ON p.grade_category_id = gc.id
      WHERE p.student_id = ?
      ORDER BY p.created_at DESC
    `, [studentId]);
    return rows;
  },

  async findByTeacherId(teacherId) {
    const [rows] = await pool.query(`
      SELECT p.id, p.student_id, p.teacher_id, p.task_id, p.grade_category_id,
             p.grade, p.created_at, p.updated_at,
             s.nip as student_nip, u.name as student_name,
             t.nrp as teacher_nrp, tu.name as teacher_name,
             ta.title as task_title, ta.type as task_type,
             gc.name as category_name
      FROM performances p
      JOIN students s ON p.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN teachers t ON p.teacher_id = t.id
      JOIN users tu ON t.user_id = tu.id
      JOIN tasks ta ON p.task_id = ta.id
      LEFT JOIN grade_categories gc ON p.grade_category_id = gc.id
      WHERE p.teacher_id = ?
      ORDER BY p.created_at DESC
    `, [teacherId]);
    return rows;
  },

  async findByTaskId(taskId) {
    const [rows] = await pool.query(`
      SELECT p.id, p.student_id, p.teacher_id, p.task_id, p.grade_category_id,
             p.grade, p.created_at, p.updated_at,
             s.nip as student_nip, u.name as student_name,
             t.nrp as teacher_nrp, tu.name as teacher_name,
             ta.title as task_title, ta.type as task_type,
             gc.name as category_name
      FROM performances p
      JOIN students s ON p.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN teachers t ON p.teacher_id = t.id
      JOIN users tu ON t.user_id = tu.id
      JOIN tasks ta ON p.task_id = ta.id
      LEFT JOIN grade_categories gc ON p.grade_category_id = gc.id
      WHERE p.task_id = ?
      ORDER BY p.created_at DESC
    `, [taskId]);
    return rows;
  },

  async findByCategoryId(categoryId) {
    const [rows] = await pool.query(`
      SELECT p.id, p.student_id, p.teacher_id, p.task_id, p.grade_category_id,
             p.grade, p.created_at, p.updated_at,
             s.nip as student_nip, u.name as student_name,
             t.nrp as teacher_nrp, tu.name as teacher_name,
             ta.title as task_title, ta.type as task_type,
             gc.name as category_name
      FROM performances p
      JOIN students s ON p.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN teachers t ON p.teacher_id = t.id
      JOIN users tu ON t.user_id = tu.id
      JOIN tasks ta ON p.task_id = ta.id
      LEFT JOIN grade_categories gc ON p.grade_category_id = gc.id
      WHERE p.grade_category_id = ?
      ORDER BY p.created_at DESC
    `, [categoryId]);
    return rows;
  },

  // ─── Create ─────────────────────────────────────────────
  async create({ student_id, teacher_id, task_id, grade_category_id, grade }) {
    const [result] = await pool.query(
      "INSERT INTO performances (student_id, teacher_id, task_id, grade_category_id, grade) VALUES (?, ?, ?, ?, ?)",
      [student_id, teacher_id, task_id, grade_category_id, grade]
    );
    return this.findById(result.insertId);
  },

  // ─── Update ─────────────────────────────────────────────
  async update(id, fields) {
    const allowed = ["grade", "grade_category_id"];
    const updates = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => `${k} = ?`);

    if (updates.length === 0) return this.findById(id);

    const values = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => fields[k]);

    await pool.query(
      `UPDATE performances SET ${updates.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  },

  // ─── Delete ─────────────────────────────────────────────
  async delete(id) {
    const [result] = await pool.query(
      "DELETE FROM performances WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

export default Performance;
