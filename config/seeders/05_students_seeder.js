import pool from "../db.js";
import bcrypt from "bcryptjs";

export const seedStudents = async () => {
  try {
    // Check if student users already exist
    const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'students'");
    
    if (count > 0) {
      console.log("⏭️  Student users already seeded, skipping...");
      return;
    }

    const hashedPassword = await bcrypt.hash("student123", 10);

    // Fetch group IDs
    const [groups] = await pool.query("SELECT id, grade FROM `groups` LIMIT 3");
    
    if (groups.length === 0) {
      console.error("❌ No groups found. Please seed groups first.");
      return;
    }

    const students = [
      {
        name: "Muhammad Rafli Pratama",
        email: "rafli.pratama@student.sespima.com",
        password: hashedPassword,
        role: "students",
        phone_number: "081234567896",
        file_id: null,
        address: "Jl. Merdeka No. 129, Jakarta",
        birth_date: "2005-02-20",
        nip: "0001/X-IPA-1/2024",
        group_id: groups[0].id,
        grade: "10",
        religion: "Islam",
      },
      {
        name: "Siti Nurhaliza",
        email: "nurhaliza@student.sespima.com",
        password: hashedPassword,
        role: "students",
        phone_number: "081234567897",
        file_id: null,
        address: "Jl. Merdeka No. 130, Jakarta",
        birth_date: "2005-05-10",
        nip: "0002/X-IPA-1/2024",
        group_id: groups[0].id,
        grade: "10",
        religion: "Islam",
      },
      {
        name: "Budi Santoso",
        email: "budi.santoso@student.sespima.com",
        password: hashedPassword,
        role: "students",
        phone_number: "081234567898",
        file_id: null,
        address: "Jl. Merdeka No. 131, Jakarta",
        birth_date: "2005-09-15",
        nip: "0003/X-IPA-2/2024",
        group_id: groups[1].id,
        grade: "10",
        religion: "Kristen",
      },
      {
        name: "Dewi Lestari",
        email: "dewi.lestari@student.sespima.com",
        password: hashedPassword,
        role: "students",
        phone_number: "081234567899",
        file_id: null,
        address: "Jl. Merdeka No. 132, Jakarta",
        birth_date: "2005-12-05",
        nip: "0004/X-IPS-1/2024",
        group_id: groups[2].id,
        grade: "10",
        religion: "Islam",
      },
      {
        name: "Ahmad Rizki",
        email: "ahmad.rizki@student.sespima.com",
        password: hashedPassword,
        role: "students",
        phone_number: "081234567900",
        file_id: null,
        address: "Jl. Merdeka No. 133, Jakarta",
        birth_date: "2005-11-25",
        nip: "0005/X-IPA-1/2024",
        group_id: groups[0].id,
        grade: "10",
        religion: "Islam",
      },
    ];

    for (const student of students) {
      // Insert user
      const [userResult] = await pool.query(
        "INSERT INTO users (name, email, password, role, is_active, phone_number, file_id, address, birth_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [student.name, student.email, student.password, student.role, 1, student.phone_number, student.file_id, student.address, student.birth_date]
      );

      // Insert student record
      await pool.query(
        "INSERT INTO students (nip, user_id, group_id, grade, religion) VALUES (?, ?, ?, ?, ?)",
        [student.nip, userResult.insertId, student.group_id, student.grade, student.religion]
      );
    }

    console.log("✅ Student users seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding student users:", error.message);
    throw error;
  }
};
