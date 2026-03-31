import pool from "../db.js";

export const seedPoints = async () => {
  try {
    // Check if points already exist
    const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM points");
    
    if (count > 0) {
      console.log("⏭️  Points already seeded, skipping...");
      return;
    }

    const pointsData = [
      { name: 'Pelanggaran Disiplin Ringan', category: 'Pelanggaran', points: -5, description: 'Terlambat masuk kelas atau apel rutin tanpa keterangan sah.' },
      { name: 'Prestasi Akademik Luar Biasa', category: 'Prestasi', points: 15, description: 'Mendapatkan nilai sempurna dalam evaluasi akhir semester.' },
      { name: 'Pelanggaran Disiplin Sedang', category: 'Pelanggaran', points: -15, description: 'Meninggalkan area pendidikan tanpa ijin tertulis dari atasan.' },
      { name: 'Juara Lomba Karya Tulis Ilmiah', category: 'Prestasi', points: 10, description: 'Meraih peringkat 1-3 dalam kompetisi tingkat nasional.' },
      { name: 'Pelanggaran Atribut Seragam', category: 'Pelanggaran', points: -3, description: 'Tidak mengenakan atribut lengkap saat dinas harian.' },
    ];

    for (const data of pointsData) {
      await pool.query(
        "INSERT INTO points (name, category, points, description) VALUES (?, ?, ?, ?)",
        [data.name, data.category, data.points, data.description]
      );
    }

    console.log("✅ Points seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding points:", error.message);
    throw error;
  }
};
