import pool from "../db.js";

export const seedGroups = async () => {
  try {
    // Check if groups already exist
    const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM `groups`");
    
    if (count > 0) {
      console.log("⏭️  Groups already seeded, skipping...");
      return;
    }

    const groups = [
      { name: "X IPA 1", grade: "10" },
      { name: "X IPA 2", grade: "10" },
      { name: "X IPS 1", grade: "10" },
      { name: "XI IPA 1", grade: "11" },
      { name: "XI IPA 2", grade: "11" },
      { name: "XI IPS 1", grade: "11" },
      { name: "XII IPA 1", grade: "12" },
      { name: "XII IPA 2", grade: "12" },
      { name: "XII IPS 1", grade: "12" },
    ];

    for (const group of groups) {
      await pool.query(
        "INSERT INTO `groups` (name, grade) VALUES (?, ?)",
        [group.name, group.grade]
      );
    }

    console.log("✅ Groups seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding groups:", error.message);
    throw error;
  }
};
