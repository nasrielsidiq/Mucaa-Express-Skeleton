import pool from "../db.js";
import bcrypt from "bcryptjs";

export const seedDirectors = async () => {
  try {
    // Check if director users already exist
    const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'director'");
    
    if (count > 0) {
      console.log("⏭️  Director users already seeded, skipping...");
      return;
    }

    const hashedPassword = await bcrypt.hash("director123", 10);

    const directors = [
      {
        name: "Dr. Ahmad Syaiful",
        email: "ahmad.syaiful@sespima.com",
        password: hashedPassword,
        role: "director",
        phone_number: "081234567892",
        file_id: null,
        address: "Jl. Merdeka No. 125, Jakarta",
        birth_date: "1975-03-10",
        nrp: "19800101",
        position: "Kepala Sekolah",
        unit: "Kepala Sekolah",
      },
      {
        name: "Drs. Budi Santoso",
        email: "budi.santoso@sespima.com",
        password: hashedPassword,
        role: "director",
        phone_number: "081234567893",
        file_id: null,
        address: "Jl. Merdeka No. 126, Jakarta",
        birth_date: "1978-07-20",
        nrp: "19850215",
        position: "Wakil Kepala Sekolah",
        unit: "Kurikulum",
      },
    ];

    for (const director of directors) {
      // Insert user
      const [userResult] = await pool.query(
        "INSERT INTO users (name, email, password, role, is_active, phone_number, file_id, address, birth_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [director.name, director.email, director.password, director.role, 1, director.phone_number, director.file_id, director.address, director.birth_date]
      );

      // Insert director record
      await pool.query(
        "INSERT INTO directors (user_id, nrp, position, unit) VALUES (?, ?, ?, ?)",
        [userResult.insertId, director.nrp, director.position, director.unit]
      );
    }

    console.log("✅ Director users seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding director users:", error.message);
    throw error;
  }
};
