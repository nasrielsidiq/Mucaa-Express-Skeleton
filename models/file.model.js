import pool from "../config/db.js";

const File = {
  // ─── Find ───────────────────────────────────────────────
  async findAll() {
    const [rows] = await pool.query(
      "SELECT id, filename, original_name, mimetype, size, file_path, file_url, file_type, created_at FROM files WHERE is_active = 1 ORDER BY created_at DESC"
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, filename, original_name, mimetype, size, file_path, file_url, file_type, created_at FROM files WHERE id = ? AND is_active = 1",
      [id]
    );
    return rows[0] || null;
  },

  async findByType(type) {
    const [rows] = await pool.query(
      "SELECT id, filename, original_name, mimetype, size, file_path, file_url, file_type, created_at FROM files WHERE file_type = ? AND is_active = 1 ORDER BY created_at DESC",
      [type]
    );
    return rows;
  },

  async findByUserId(userId) {
    const [rows] = await pool.query(
      "SELECT id, filename, original_name, mimetype, size, file_path, file_url, file_type, created_at FROM files WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC",
      [userId]
    );
    return rows;
  },

  async findUserProfileFile(userId) {
    const [rows] = await pool.query(
      "SELECT id, filename, original_name, mimetype, size, file_path, file_url FROM files WHERE user_id = ? AND file_type = 'profile' AND is_active = 1 LIMIT 1",
      [userId]
    );
    return rows[0] || null;
  },

  // ─── Create ─────────────────────────────────────────────
  async create(fileData) {
    const {
      filename,
      original_name,
      mimetype,
      size,
      file_path,
      file_url,
      file_type = "image",
    } = fileData;

    const [result] = await pool.query(
      "INSERT INTO files (filename, original_name, mimetype, size, file_path, file_url, file_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [filename, original_name, mimetype, size, file_path, file_url, file_type]
    );

    return this.findById(result.insertId);
  },

  // ─── Update ─────────────────────────────────────────────
  async update(id, fields) {
    const allowed = ["user_id", "file_type"];
    const updates = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => `${k} = ?`);

    if (updates.length === 0) return this.findById(id);

    const values = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => fields[k]);

    await pool.query(`UPDATE files SET ${updates.join(", ")} WHERE id = ?`, [
      ...values,
      id,
    ]);

    return this.findById(id);
  },

  // ─── Delete ─────────────────────────────────────────────
  async delete(id) {
    await pool.query("UPDATE files SET is_active = 0 WHERE id = ?", [id]);
    return { success: true };
  },

  async hardDelete(id) {
    await pool.query("DELETE FROM files WHERE id = ?", [id]);
    return { success: true };
  },
};

export default File;
