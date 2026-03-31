import pool from "../db.js";

export const seedGrades = async () => {
  try {
    // Check if grades already exist
    const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM grades");
    
    if (count > 0) {
      console.log("⏭️  Grades already seeded, skipping...");
      return;
    }

    // Fetch required references
    const [students] = await pool.query("SELECT id FROM students LIMIT 5");
    const [teachers] = await pool.query("SELECT id FROM teachers LIMIT 3");
    const [categories] = await pool.query("SELECT id FROM grade_categories LIMIT 4");

    if (students.length === 0 || teachers.length === 0 || categories.length === 0) {
      console.error("❌ Need students, teachers, and grade categories to seed grades. Please seed them first.");
      return;
    }

    const gradesToInsert = [
      {
        student_id: students[0].id,
        teacher_id: teachers[0].id,
        grade_category_id: categories[0].id,
        grade: "95",
      },
      {
        student_id: students[0].id,
        teacher_id: teachers[0].id,
        grade_category_id: categories[1].id,
        grade: "88",
      },
      {
        student_id: students[1].id,
        teacher_id: teachers[1].id,
        grade_category_id: categories[2].id,
        grade: "75",
      },
      {
        student_id: students[2].id,
        teacher_id: teachers[2].id,
        grade_category_id: categories[3].id,
        grade: "82",
      },
      {
        student_id: students[3].id,
        teacher_id: teachers[0].id,
        grade_category_id: categories[0].id,
        grade: "90",
      },
    ];

    for (const data of gradesToInsert) {
      await pool.query(
        "INSERT INTO grades (student_id, teacher_id, grade_category_id, grade) VALUES (?, ?, ?, ?)",
        [data.student_id, data.teacher_id, data.grade_category_id, data.grade]
      );
    }

    console.log("✅ Grades seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding grades:", error.message);
    throw error;
  }
};
