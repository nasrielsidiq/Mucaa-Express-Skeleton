import pool from "../db.js";
import bcrypt from "bcryptjs";

export const seedAdmins = async () => {
  try {
    // Check if admin users already exist
    const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
    
    if (count > 0) {
      console.log("⏭️  Admin users already seeded, skipping...");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admins = [
      {
        name: "Admin User",
        email: "admin@sespima.com",
        password: hashedPassword,
        phone_number: "081234567890",
        image: null,
        address: "Jl. Merdeka No. 123, Jakarta",
        birth_date: "1990-01-01",
        role: "admin",
      },
      {
        name: "Super Admin",
        email: "superadmin@sespima.com",
        password: hashedPassword,
        phone_number: "081234567891",
        image: null,
        address: "Jl. Merdeka No. 124, Jakarta",
        birth_date: "1985-05-15",
        role: "admin",
      },
    ];

    for (const admin of admins) {
      await pool.query(
        "INSERT INTO users (name, email, password, role, is_active, phone_number, image, address, birth_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [admin.name, admin.email, admin.password, admin.role, 1, admin.phone_number, admin.image, admin.address, admin.birth_date]
      );
    }

    console.log("✅ Admin users seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding admin users:", error.message);
    throw error;
  }
};
