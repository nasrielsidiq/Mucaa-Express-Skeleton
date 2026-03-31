import pool from "../config/db.js";

const Task = {
  // ─── Find ───────────────────────────────────────────────
  async findAll() {
    const [rows] = await pool.query(`
      SELECT t.id, t.teacher_id, t.title, t.description, t.type,
             t.is_by_location, t.location_id,
             t.start_date, t.due_date, t.start_time, t.due_time, 
             t.status, t.created_at, t.updated_at,
             te.nrp as teacher_nrp, u.name as teacher_name
      FROM tasks t
      JOIN teachers te ON t.teacher_id = te.id
      JOIN users u ON te.user_id = u.id
      ORDER BY t.created_at DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT t.id, t.teacher_id, t.title, t.description, t.type,
             t.is_by_location, t.location_id,
             t.start_date, t.due_date, t.start_time, t.due_time, 
             t.status, t.created_at, t.updated_at,
             te.nrp as teacher_nrp, u.name as teacher_name
      FROM tasks t
      JOIN teachers te ON t.teacher_id = te.id
      JOIN users u ON te.user_id = u.id
      WHERE t.id = ?
    `, [id]);
    return rows[0] || null;
  },

  async findByTeacherId(teacherId) {
    const [rows] = await pool.query(`
      SELECT t.id, t.teacher_id, t.title, t.description, t.type,
             t.is_by_location, t.location_id,
             t.start_date, t.due_date, t.start_time, t.due_time, 
             t.status, t.created_at, t.updated_at,
             te.nrp as teacher_nrp, u.name as teacher_name
      FROM tasks t
      JOIN teachers te ON t.teacher_id = te.id
      JOIN users u ON te.user_id = u.id
      WHERE t.teacher_id = ?
      ORDER BY t.created_at DESC
    `, [teacherId]);
    return rows;
  },

  async findByStatus(status) {
    const [rows] = await pool.query(`
      SELECT t.id, t.teacher_id, t.title, t.description, t.type,
             t.is_by_location, t.location_id,
             t.start_date, t.due_date, t.start_time, t.due_time, 
             t.status, t.created_at, t.updated_at,
             te.nrp as teacher_nrp, u.name as teacher_name
      FROM tasks t
      JOIN teachers te ON t.teacher_id = te.id
      JOIN users u ON te.user_id = u.id
      WHERE t.status = ?
      ORDER BY t.due_date ASC
    `, [status]);
    return rows;
  },

  async findByType(type) {
    const [rows] = await pool.query(`
      SELECT t.id, t.teacher_id, t.title, t.description, t.type,
             t.is_by_location, t.location_id,
             t.start_date, t.due_date, t.start_time, t.due_time, 
             t.status, t.created_at, t.updated_at,
             te.nrp as teacher_nrp, u.name as teacher_name
      FROM tasks t
      JOIN teachers te ON t.teacher_id = te.id
      JOIN users u ON te.user_id = u.id
      WHERE t.type = ?
      ORDER BY t.due_date ASC
    `, [type]);
    return rows;
  },

  // ─── Create ─────────────────────────────────────────────
  async create({ teacher_id, title, description, type = 'sprint', is_by_location = false, location_id = null, start_date, due_date, start_time, due_time, status = 'active' }) {
    const [result] = await pool.query(
      "INSERT INTO tasks (teacher_id, title, description, type, is_by_location, location_id, start_date, due_date, start_time, due_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [teacher_id, title, description, type, is_by_location, location_id, start_date, due_date, start_time, due_time, status]
    );
    return this.findById(result.insertId);
  },

  // ─── Update ─────────────────────────────────────────────
  async update(id, fields) {
    const allowed = ["title", "description", "type", "is_by_location", "location_id", "start_date", "due_date", "start_time", "due_time", "status"];
    const updates = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => `${k} = ?`);

    if (updates.length === 0) return this.findById(id);

    const values = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => fields[k]);

    await pool.query(
      `UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  },

  // ─── Delete ─────────────────────────────────────────────
  async delete(id) {
    const [result] = await pool.query(
      "DELETE FROM tasks WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

export default Task;
