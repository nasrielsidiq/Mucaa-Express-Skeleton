import pool from "../db.js";
import bcrypt from "bcryptjs";

export const seedTeachers = async () => {
  try {
    // Check if teacher users already exist
    const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'teacher'");
    
    if (count > 0) {
      console.log("⏭️  Teacher users already seeded, skipping...");
      return;
    }

    const hashedPassword = await bcrypt.hash("teacher123", 10);

    const teachers = [
      {
        name: "Ibu Siti Nur Azizah",
        email: "siti.azizah@sespima.com",
        password: hashedPassword,
        role: "teacher",
        nrp: "19880320",
        rank: "III/b",
        position: "Guru Matematika",
      },
      {
        name: "Bapak Wahyu Hermawan",
        email: "wahyu.hermawan@sespima.com",
        password: hashedPassword,
        role: "teacher",
        nrp: "19850612",
        rank: "III/c",
        position: "Guru Bahasa Inggris",
      },
      {
        name: "Ibu Rini Suryani",
        email: "rini.suryani@sespima.com",
        password: hashedPassword,
        role: "teacher",
        phone_number: "081234567894",
        file_id: null,
        address: "Jl. Merdeka No. 127, Jakarta",
        birth_date: "1990-08-15",
        nrp: "19900815",
        rank: "III/a",
        position: "Guru Fisika",
      },
      {
        name: "Bapak Andi Setiawan",
        email: "andi.setiawan@sespima.com",
        password: hashedPassword,
        role: "teacher",
        phone_number: "081234567895",
        file_id: null,
        address: "Jl. Merdeka No. 128, Jakarta",
        birth_date: "1987-04-27",
        nrp: "19870427",
        rank: "III/b",
        position: "Guru Biologi",
      },
    ];

    for (const teacher of teachers) {
      // Insert user
      const [userResult] = await pool.query(
        "INSERT INTO users (name, email, password, role, is_active, phone_number, file_id, address, birth_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [teacher.name, teacher.email, teacher.password, teacher.role, 1, teacher.phone_number, teacher.file_id, teacher.address, teacher.birth_date]
      );

      // Insert teacher record
      await pool.query(
        "INSERT INTO teachers (user_id, nrp, \`rank\`, \`position\`) VALUES (?, ?, ?, ?)",
        [userResult.insertId, teacher.nrp, teacher.rank, teacher.position]
      );
    }

    console.log("✅ Teacher users seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding teacher users:", error.message);
    throw error;
  }
};
