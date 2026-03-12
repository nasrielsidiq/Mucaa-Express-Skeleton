import pool from "../config/db.js";

const GivedTask = {
  // ─── Find ───────────────────────────────────────────────
  async findAll() {
    const [rows] = await pool.query(`
      SELECT gt.id, gt.task_id, gt.student_id, gt.filepath, gt.rates, gt.status,
             gt.created_at, gt.updated_at,
             t.title as task_title, t.due_date,
             s.nip as student_nip, u.name as student_name
      FROM gived_tasks gt
      JOIN tasks t ON gt.task_id = t.id
      JOIN users u ON gt.student_id = u.id
      LEFT JOIN students s ON s.user_id = u.id
      ORDER BY gt.created_at DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT gt.id, gt.task_id, gt.student_id, gt.filepath, gt.rates, gt.status,
             gt.created_at, gt.updated_at,
             t.title as task_title, t.due_date,
             s.nip as student_nip, u.name as student_name
      FROM gived_tasks gt
      JOIN tasks t ON gt.task_id = t.id
      JOIN users u ON gt.student_id = u.id
      LEFT JOIN students s ON s.user_id = u.id
      WHERE gt.id = ?
    `, [id]);
    return rows[0] || null;
  },

  async findByTaskId(taskId) {
    const [rows] = await pool.query(`
      SELECT gt.id, gt.task_id, gt.student_id, gt.filepath, gt.rates, gt.status,
             gt.created_at, gt.updated_at,
             t.title as task_title, t.due_date,
             s.nip as student_nip, u.name as student_name
      FROM gived_tasks gt
      JOIN tasks t ON gt.task_id = t.id
      JOIN users u ON gt.student_id = u.id
      LEFT JOIN students s ON s.user_id = u.id
      WHERE gt.task_id = ?
      ORDER BY gt.created_at DESC
    `, [taskId]);
    return rows;
  },

  async findByStudentId(studentId) {
    const [rows] = await pool.query(`
      SELECT gt.id, gt.task_id, gt.student_id, gt.filepath, gt.rates, gt.status,
             gt.created_at, gt.updated_at,
             t.title as task_title, t.due_date,
             s.nip as student_nip, u.name as student_name
      FROM gived_tasks gt
      JOIN tasks t ON gt.task_id = t.id
      JOIN users u ON gt.student_id = u.id
      LEFT JOIN students s ON s.user_id = u.id
      WHERE gt.student_id = ?
      ORDER BY gt.created_at DESC
    `, [studentId]);
    return rows;
  },

  async findByStatus(status) {
    const [rows] = await pool.query(`
      SELECT gt.id, gt.task_id, gt.student_id, gt.filepath, gt.rates, gt.status,
             gt.created_at, gt.updated_at,
             t.title as task_title, t.due_date,
             s.nip as student_nip, u.name as student_name
      FROM gived_tasks gt
      JOIN tasks t ON gt.task_id = t.id
      JOIN users u ON gt.student_id = u.id
      LEFT JOIN students s ON s.user_id = u.id
      WHERE gt.status = ?
      ORDER BY gt.created_at DESC
    `, [status]);
    return rows;
  },

  // ─── Create ─────────────────────────────────────────────
  async create({ task_id, student_id, filepath = null, rates = null, status = 'pending' }) {
    const [result] = await pool.query(
      "INSERT INTO gived_tasks (task_id, student_id, filepath, rates, status) VALUES (?, ?, ?, ?, ?)",
      [task_id, student_id, filepath, rates, status]
    );
    return this.findById(result.insertId);
  },

  // ─── Update ─────────────────────────────────────────────
  async update(id, fields) {
    const allowed = ["filepath", "rates", "status"];
    const updates = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => `${k} = ?`);

    if (updates.length === 0) return this.findById(id);

    const values = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => fields[k]);

    await pool.query(
      `UPDATE gived_tasks SET ${updates.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  },

  // ─── Delete ─────────────────────────────────────────────
  async delete(id) {
    const [result] = await pool.query(
      "DELETE FROM gived_tasks WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

export default GivedTask;
