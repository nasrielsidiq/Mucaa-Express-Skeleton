import pool from "../db.js";

export const seedLocations = async () => {
  try {
    // Check if locations already exist
    const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM locations");
    
    if (count > 0) {
      console.log("⏭️  Locations already seeded, skipping...");
      return;
    }

    const locationsData = [
      { name: 'Lapangan Utama', icon: 'location_on', latitude: -6.12300000, longitude: 106.45600000, radius: 50, status: 'AKTIF' },
      { name: 'Auditorium', icon: 'meeting_room', latitude: null, longitude: null, radius: 0, status: 'AKTIF' },
      { name: 'Gedung Serbaguna', icon: 'apartment', latitude: null, longitude: null, radius: 0, status: 'TERSEDIA' },
      { name: 'Lapangan Belakang', icon: 'handyman', latitude: -6.12500000, longitude: 106.45800000, radius: 50, status: 'RENOVASI' },
    ];

    for (const data of locationsData) {
      await pool.query(
        "INSERT INTO locations (name, icon, latitude, longitude, radius, status) VALUES (?, ?, ?, ?, ?, ?)",
        [data.name, data.icon, data.latitude, data.longitude, data.radius, data.status]
      );
    }

    console.log("✅ Locations seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding locations:", error.message);
    throw error;
  }
};
