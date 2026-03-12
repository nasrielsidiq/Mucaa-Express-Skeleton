import pool from "../config/db.js";
import bcrypt from "bcryptjs";

const User = {
  // ─── Find ───────────────────────────────────────────────
  async findAll() {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, is_active, created_at FROM users WHERE is_active = 1"
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ? AND is_active = 1",
      [id]
    );
    return rows[0] || null;
  },

  async findByEmail(email, withPassword = false) {
    const fields = withPassword
      ? "id, name, email, password, role, is_active"
      : "id, name, email, role, is_active";

    const [rows] = await pool.query(
      `SELECT ${fields} FROM users WHERE email = ? AND is_active = 1`,
      [email]
    );
    return rows[0] || null;
  },

  // ─── Create ─────────────────────────────────────────────
  async create({ name, email, password, role = "student", phone_number = null, address = null, birth_date = null }) {
    const hashed = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role, phone_number, address, birth_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, email, hashed, role, phone_number, address, birth_date]
    );

    return this.findById(result.insertId);
  },

  // ─── Update ─────────────────────────────────────────────
  async update(id, fields) {
    // Build dynamic SET clause safely
    const allowed = ["name", "email", "phone_number", "address", "birth_date"];
    const updates = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => `${k} = ?`);

    if (updates.length === 0) return this.findById(id);

    const values = Object.keys(fields)
      .filter((k) => allowed.includes(k))
      .map((k) => fields[k]);

    await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  },

  // ─── Soft Delete ────────────────────────────────────────
  async softDelete(id) {
    const [result] = await pool.query(
      "UPDATE users SET is_active = 0 WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  // ─── Compare Password ───────────────────────────────────
  async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  },
};

export default User;