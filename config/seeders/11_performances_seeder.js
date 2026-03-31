import pool from "../db.js";

export const seedPerformances = async () => {
  try {
    // Check if performances already exist
    const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM performances");

    if (count > 0) {
      console.log("⏭️  Performances already seeded, skipping...");
      return;
    }

    // Fetch required references
    const [students] = await pool.query("SELECT id FROM students");
    const [teachers] = await pool.query("SELECT id FROM teachers");
    const [tasks] = await pool.query("SELECT id, type FROM tasks");
    const [categories] = await pool.query("SELECT id FROM grade_categories");

    if (students.length === 0 || teachers.length === 0 || tasks.length === 0) {
      console.warn("⚠️  Missing students, teachers, or tasks. Skipping performances seeding...");
      return;
    }

    const sprintTasks = tasks.filter(t => t.type === 'sprint');
    const apelTasks = tasks.filter(t => t.type === 'apel');

    const performanceData = [];

    // Seed sprint-based performances (academic)
    for (const student of students) {
      for (const task of sprintTasks) {
        const teacher = teachers[Math.floor(Math.random() * teachers.length)];
        const category = categories.length > 0 ? categories[Math.floor(Math.random() * categories.length)] : null;
        // Realistic spread: most 70-95, some below 70 to trigger dashboard low-score
        const value = Math.round((55 + Math.random() * 40) * 10) / 10;

        performanceData.push({
          student_id: student.id,
          teacher_id: teacher.id,
          task_id: task.id,
          grade_category_id: category ? category.id : null,
          value,
        });
      }
    }

    // Seed apel-based performances (mental/attendance)
    for (const student of students) {
      for (const task of apelTasks) {
        const teacher = teachers[Math.floor(Math.random() * teachers.length)];
        const category = categories.length > 0 ? categories[Math.floor(Math.random() * categories.length)] : null;
        const value = Math.round((60 + Math.random() * 38) * 10) / 10;

        performanceData.push({
          student_id: student.id,
          teacher_id: teacher.id,
          task_id: task.id,
          grade_category_id: category ? category.id : null,
          value,
        });
      }
    }

    for (const perf of performanceData) {
      await pool.query(
        "INSERT INTO performances (student_id, teacher_id, task_id, grade_category_id, value) VALUES (?, ?, ?, ?, ?)",
        [perf.student_id, perf.teacher_id, perf.task_id, perf.grade_category_id, perf.value]
      );
    }

    console.log(`✅ Performances seeded successfully (${performanceData.length} records)`);
  } catch (error) {
    console.error("❌ Error seeding performances:", error.message);
    throw error;
  }
};
