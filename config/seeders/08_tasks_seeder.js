import pool from "../db.js";

export const seedTasks = async () => {
  try {
    // Check if tasks already exist
    const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM tasks");
    
    if (count > 0) {
      console.log("⏭️  Tasks already seeded, skipping...");
      return;
    }

    // Fetch teachers to assign tasks
    const [teachers] = await pool.query("SELECT id FROM teachers");

    if (teachers.length === 0) {
      console.warn("⚠️  No teachers found to assign tasks to. Skipping tasks seeding...");
      return;
    }

    // Fetch locations to assign tasks
    const [locations] = await pool.query("SELECT id FROM locations");

    if (locations.length === 0) {
      console.warn("⚠️  No locations found to assign to tasks. Skipping tasks seeding...");
      return;
    }

    const tasks = [
      // 5 Sprint Tasks
      {
        title: "Lari Pagi (Sprint 100m)",
        description: "Lari jarak pendek sprint 100m di lapangan utama",
        type: "sprint",
        is_by_location: true,
        location_id: locations[0]?.id || 1,
        start_date: "2026-04-01",
        due_date: "2026-04-01",
        start_time: "06:00:00",
        due_time: "07:00:00",
        status: "completed",
      },
      {
        title: "Ujian Lari (Sprint 200m)",
        description: "Pengukuran waktu ujian sprint 200m",
        type: "sprint",
        is_by_location: true,
        location_id: locations[0]?.id || 1,
        start_date: "2026-04-03",
        due_date: "2026-04-03",
        start_time: "06:30:00",
        due_time: "08:30:00",
        status: "completed",
      },
      {
        title: "Latihan Fisik (Sprint 400m)",
        description: "Ketahanan fisik lari jarak menengah sprint",
        type: "sprint",
        is_by_location: true,
        location_id: locations[0]?.id || 1,
        start_date: "2026-04-05",
        due_date: "2026-04-05",
        start_time: "15:30:00",
        due_time: "17:00:00",
        status: "active",
      },
      {
        title: "Evaluasi Sprint Mingguan",
        description: "Lari sprint gabungan untuk penilaian mingguan",
        type: "sprint",
        is_by_location: true,
        location_id: locations[0]?.id || 1,
        start_date: "2026-04-07",
        due_date: "2026-04-07",
        start_time: "06:00:00",
        due_time: "08:00:00",
        status: "active",
      },
      {
        title: "Sprint Interval Training",
        description: "Latihan lari cepat dengan jeda waktu",
        type: "sprint",
        is_by_location: true,
        location_id: locations[0]?.id || 1,
        start_date: "2026-04-10",
        due_date: "2026-04-10",
        start_time: "16:00:00",
        due_time: "17:30:00",
        status: "active",
      },

      // 5 Apel Tasks
      {
        title: "Apel Pagi Gabungan",
        description: "Apel pagi gabungan seluruh angkatan",
        type: "apel",
        is_by_location: true,
        location_id: locations[1]?.id || 2,
        start_date: "2026-04-02",
        due_date: "2026-04-02",
        start_time: "07:00:00",
        due_time: "08:00:00",
        status: "completed",
      },
      {
        title: "Apel Kelengkapan Pasukan",
        description: "Pengecekan seragam dan kelengkapan",
        type: "apel",
        is_by_location: true,
        location_id: locations[1]?.id || 2,
        start_date: "2026-04-04",
        due_date: "2026-04-04",
        start_time: "13:00:00",
        due_time: "14:00:00",
        status: "active",
      },
      {
        title: "Apel Malam Persiapan Istirahat",
        description: "Apel pengecekan jumlah personel sebelum istirahat malam",
        type: "apel",
        is_by_location: true,
        location_id: locations[1]?.id || 2,
        start_date: "2026-04-06",
        due_date: "2026-04-06",
        start_time: "21:00:00",
        due_time: "22:00:00",
        status: "active",
      },
      {
        title: "Apel Khusus Arahan Danse",
        description: "Arahan khusus dari komandan sekolah",
        type: "apel",
        is_by_location: true,
        location_id: locations[1]?.id || 2,
        start_date: "2026-04-08",
        due_date: "2026-04-08",
        start_time: "08:00:00",
        due_time: "10:00:00",
        status: "active",
      },
      {
        title: "Apel Kesiapsiagaan Akhir Pekan",
        description: "Pengecekan personel menjelang libur akhir pekan",
        type: "apel",
        is_by_location: true,
        location_id: locations[1]?.id || 2,
        start_date: "2026-04-11",
        due_date: "2026-04-11",
        start_time: "16:00:00",
        due_time: "17:00:00",
        status: "active",
      }
    ];

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const teacher_id = teachers[i % teachers.length].id;
        
        await pool.query(
            "INSERT INTO tasks (teacher_id, title, description, type, is_by_location, location_id, start_date, due_date, start_time, due_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                teacher_id, 
                task.title, 
                task.description, 
                task.type, 
                task.is_by_location,
                task.location_id,
                task.start_date, 
                task.due_date, 
                task.start_time, 
                task.due_time,
                task.status
            ]
        );
    }

    console.log("✅ Tasks seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding tasks:", error.message);
    throw error;
  }
};
