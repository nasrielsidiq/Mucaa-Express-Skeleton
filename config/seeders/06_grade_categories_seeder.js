import pool from "../db.js";

export const seedGradeCategories = async () => {
  try {
    // Check if grade categories already exist
    const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM grade_categories");
    
    if (count > 0) {
      console.log("⏭️  Grade categories already seeded, skipping...");
      return;
    }

    const categories = [
      {
        name: "Tugas Kehadiran",
        value: 10,
        description: "Nilai kehadiran siswa",
      },
      {
        name: "Nilai Tugas",
        value: 20,
        description: "Nilai tugas harian",
      },
      {
        name: "Nilai UTS",
        value: 30,
        description: "Nilai Ujian Tengah Semester",
      },
      {
        name: "Nilai UAS",
        value: 40,
        description: "Nilai Ujian Akhir Semester",
      },
    ];

    for (const category of categories) {
      await pool.query(
        "INSERT INTO grade_categories (name, value, description) VALUES (?, ?, ?)",
        [category.name, category.value, category.description]
      );
    }

    console.log("✅ Grade categories seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding grade categories:", error.message);
    throw error;
  }
};
