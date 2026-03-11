import pool from "../db.js";
import bcrypt from "bcryptjs";

export const seedUsers = async () => {
  try {
    // Check if users already exist
    const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM users");
    
    if (count > 0) {
      console.log("⏭️  Users table already seeded, skipping...");
      return;
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = [
      {
        name: "Admin User",
        email: "admin@sespima.com",
        password: hashedPassword,
        role: "admin",
        is_active: 1,
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        role: "user",
        is_active: 1,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: hashedPassword,
        role: "user",
        is_active: 1,
      },
    ];

    for (const user of users) {
      await pool.query(
        "INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)",
        [user.name, user.email, user.password, user.role, user.is_active]
      );
    }

    console.log("✅ Users seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding users:", error.message);
    throw error;
  }
};
