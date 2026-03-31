import pool from "../config/db.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

function formatDateId(date) {
  if (!date) return '-';
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function calculateDeadlineNote(dueDate, dueTime) {
  if (!dueDate) return '-';
  
  const now = new Date();
  const due = new Date(dueDate);

  if (dueTime) {
    const parts = dueTime.split(':');
    due.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), parts[2] ? parseInt(parts[2], 10) : 0);
  } else {
    due.setHours(23, 59, 59);
  }

  const diffMs = due - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Terlewat';
  } else if (diffDays === 0) {
    if (dueTime) {
      return `Pukul ${dueTime.substring(0, 5)}`;
    }
    return 'Hari ini';
  } else {
    return `${diffDays} Hari Lagi`;
  }
}

function mapStatus(status) {
  switch (status) {
    case 'active': return 'Aktif';
    case 'completed': return 'Selesai';
    case 'late': return 'Terlambat';
    default: return status ? status : 'Aktif';
  }
}

export const getTaskManagementData = async (req, res, next) => {
  try {
    const [summaryRows] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as selesai,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as overdue
      FROM tasks
    `);
    
    const summaryCardInfo = summaryRows[0] || {};
    
    const summaryCards = [
      {
        data_name: 'Total Tugas',
        data: (summaryCardInfo.total || 0).toString(),
      },
      {
        data_name: 'Selesai',
        data: (summaryCardInfo.selesai || 0).toString(),
      },
      {
        data_name: 'Pending',
        data: (summaryCardInfo.pending || 0).toString(),
      },
      {
        data_name: 'Overdue',
        data: (summaryCardInfo.overdue || 0).toString(),
      },
    ];

    const [taskRows] = await pool.query(`
      SELECT 
        t.id, 
        t.title,
        t.type,
        t.due_date,
        t.due_time,
        t.status,
        (
          SELECT GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ')
          FROM gived_tasks gt
          JOIN users u ON gt.student_id = u.id
          JOIN students s ON s.user_id = u.id
          JOIN \`groups\` g ON s.group_id = g.id
          WHERE gt.task_id = t.id
        ) as groups_assigned
      FROM tasks t
      ORDER BY t.created_at DESC
      LIMIT 10
    `);

    const tasks = taskRows.map(row => {
      let deadlineNote = '-';
      if (row.status === 'completed') {
        deadlineNote = 'Selesai';
      } else {
        deadlineNote = calculateDeadlineNote(row.due_date, row.due_time);
      }

      const subjectName = row.type 
        ? `Tipe: ${row.type.charAt(0).toUpperCase() + row.type.slice(1)}` 
        : 'Tipe: Umum';

      return {
        id: row.id,
        title: row.title || 'Tidak ada judul',
        subject: subjectName,
        groups: row.groups_assigned ? row.groups_assigned.split(', ') : ['SEMUA POKJAR'],
        deadline: formatDateId(row.due_date),
        deadlineNote: deadlineNote,
        status: mapStatus(row.status),
      };
    });

    res.status(200).json({
      status: "success",
      data: {
        tasks,
        summaryCards
      }
    });

  } catch (err) {
    next(err);
  }
};

export const getRollCallManagementData = async (req, res, next) => {
  try {
    const [studentRows] = await pool.query(`
      SELECT s.nip, u.name, g.name as pokjar, u.id as user_id
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN \`groups\` g ON s.group_id = g.id
      ORDER BY u.name ASC
    `);

    const [latestApelRows] = await pool.query(`
      SELECT id FROM tasks WHERE type = 'apel' ORDER BY created_at DESC LIMIT 1
    `);
    
    let givedTaskMap = {};
    if (latestApelRows.length > 0) {
      const latestApelId = latestApelRows[0].id;
      const [gtRows] = await pool.query(`
        SELECT student_id, status, updated_at FROM gived_tasks WHERE task_id = ?
      `, [latestApelId]);
      
      gtRows.forEach(row => {
        givedTaskMap[row.student_id] = row;
      });
    }

    let stats = { hadir: 0, izin: 0, sakit: 0, alpa: 0 };

    const students = studentRows.map(row => {
      let status = 'Alpa';
      let scanTime = null;

      const gtRow = givedTaskMap[row.user_id];
      if (gtRow && gtRow.status === 'completed') {
        status = 'Hadir';
        const d = new Date(gtRow.updated_at);
        scanTime = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
      } else if (gtRow && gtRow.status === 'pending') {
        status = 'Alpa';
      }

      if (status === 'Hadir') stats.hadir++;
      else if (status === 'Izin') stats.izin++;
      else if (status === 'Sakit') stats.sakit++;
      else stats.alpa++;

      return {
        name: row.name,
        nrp: row.nip,
        pokjar: row.pokjar,
        status: status,
        scanTime: scanTime,
        avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(row.name),
      };
    });

    const totalStudents = studentRows.length;

    const kpiCards = [
      {
        data_name: 'Total Siswa',
        data: totalStudents.toString(),
        suffix: 'Peserta',
      },
      {
        data_name: 'Hadir',
        data: stats.hadir.toString(),
        suffix: totalStudents ? `${Math.round((stats.hadir / totalStudents) * 100)}%` : '0%',
      },
      {
        data_name: 'Izin',
        data: stats.izin.toString(),
        suffix: 'Dokumen',
      },
      {
        data_name: 'Sakit',
        data: stats.sakit.toString(),
        suffix: 'Surat',
      },
      {
        data_name: 'Alpa',
        data: stats.alpa.toString(),
        suffix: totalStudents ? `${Math.round((stats.alpa / totalStudents) * 100)}%` : '0%',
      },
    ];

    const chartBars = [
      { data_name: 'Sen', target: '60%', data: '80%' },
      { data_name: 'Sel', target: '75%', data: '90%' },
      { data_name: 'Rab', target: '80%', data: '95%' },
      { data_name: 'Kam', target: '70%', data: '85%' },
      { data_name: 'Jum', target: '85%', data: '92%' },
      { data_name: 'Sab', target: '40%', data: '50%' },
      { data_name: 'Min', target: '30%', data: '40%' },
    ];

    res.status(200).json({
      status: "success",
      data: {
        kpiCards,
        chartBars,
        students
      }
    });

  } catch (err) {
    next(err);
  }
};

export const getActivityLogData = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const filterUser = req.query.user_id || null;
    const filterModul = req.query.modul || null;
    const startDate = req.query.start_date || null;
    const endDate = req.query.end_date || null;

    // Build WHERE clauses dynamically
    const conditions = [];
    const params = [];

    if (filterUser) {
      conditions.push('la.user_id = ?');
      params.push(filterUser);
    }
    if (filterModul) {
      conditions.push('la.modul = ?');
      params.push(filterModul);
    }
    if (startDate && endDate) {
      conditions.push('DATE(la.created_at) BETWEEN ? AND ?');
      params.push(startDate, endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Summary cards
    const [todayRows] = await pool.query(`
      SELECT
        COUNT(*) as total_today,
        COUNT(DISTINCT la.user_id) as active_users,
        la.modul as top_modul,
        COUNT(*) as top_count
      FROM log_activity la
      WHERE DATE(la.created_at) = CURDATE()
      GROUP BY la.modul
      ORDER BY top_count DESC
      LIMIT 1
    `);

    const [totalTodayRows] = await pool.query(`
      SELECT COUNT(*) as total FROM log_activity WHERE DATE(created_at) = CURDATE()
    `);
    const [activeUsersRows] = await pool.query(`
      SELECT COUNT(DISTINCT user_id) as count FROM log_activity WHERE DATE(created_at) = CURDATE()
    `);
    const [yesterdayRows] = await pool.query(`
      SELECT COUNT(*) as total FROM log_activity WHERE DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
    `);

    const totalToday = totalTodayRows[0]?.total || 0;
    const totalYesterday = yesterdayRows[0]?.total || 0;
    const activeUsers = activeUsersRows[0]?.count || 0;
    const topModulRow = todayRows[0] || {};

    const activityTrend = totalYesterday > 0
      ? `${((totalToday - totalYesterday) / totalYesterday * 100).toFixed(1)}%`
      : (totalToday > 0 ? '+100%' : '0%');

    const summaryCards = [
      {
        data_name: 'Total Aktivitas (Hari Ini)',
        data: totalToday.toLocaleString('id-ID'),
        trend: (totalToday >= totalYesterday ? '+' : '') + activityTrend,
        trendNote: 'vs kemarin',
      },
      {
        data_name: 'User Aktif',
        data: activeUsers.toString(),
        trend: activeUsers.toString() + ' user',
        trendNote: 'hari ini',
      },
      {
        data_name: 'Aktivitas Modul Terbanyak',
        data: topModulRow.top_modul || 'Tidak Ada',
        trend: topModulRow.top_count ? `${topModulRow.top_count} Aksi` : '0 Aksi',
        trendNote: 'tercatat',
      },
    ];

    // Paginated logs
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM log_activity la ${whereClause}`,
      params
    );
    const totalLogs = countRows[0]?.total || 0;
    const totalPages = Math.ceil(totalLogs / limit);

    const [logRows] = await pool.query(
      `SELECT la.id, la.user_id, la.action_label, la.activity, la.modul, la.ip_address, la.created_at,
              u.name, u.email, u.role
       FROM log_activity la
       JOIN users u ON la.user_id = u.id
       ${whereClause}
       ORDER BY la.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

    const logs = logRows.map((row, index) => {
      const createdAt = new Date(row.created_at);
      const time = `${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}:${createdAt.getSeconds().toString().padStart(2, '0')}`;
      const date = `${createdAt.getDate()} ${months[createdAt.getMonth()]} ${createdAt.getFullYear()}`;

      return {
        no: String(offset + index + 1).padStart(2, '0'),
        user: row.name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=random`,
        actionLabel: row.action_label || 'Aktivitas Sistem',
        actionNote: row.activity,
        modul: row.modul || 'Lainnya',
        time,
        date,
        ip: row.ip_address || '-',
      };
    });

    // Distinct moduls available for filter dropdown
    const [modulRows] = await pool.query(
      `SELECT DISTINCT modul FROM log_activity WHERE modul IS NOT NULL ORDER BY modul ASC`
    );
    const modulOptions = modulRows.map(r => r.modul);

    res.status(200).json({
      status: 'success',
      data: {
        summaryCards,
        logs,
        modulOptions,
        pagination: {
          page,
          limit,
          total: totalLogs,
          totalPages,
        },
      },
    });

  } catch (err) {
    next(err);
  }
};

export const getDashboardData = async (req, res, next) => {
  try {
    const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

    // ── Stats Cards ──────────────────────────────────────────────────────────
    const [[{ totalStudents }]] = await pool.query(`SELECT COUNT(*) as totalStudents FROM students`);
    const [[{ activeTasks }]] = await pool.query(`SELECT COUNT(*) as activeTasks FROM tasks WHERE status = 'active'`);

    // Average academic score (sprint tasks)
    const [[academicRow]] = await pool.query(`
      SELECT ROUND(AVG(p.value), 1) as avg_academic
      FROM performances p
      JOIN tasks t ON p.task_id = t.id
      WHERE t.type = 'sprint'
    `);

    // Average mental score (apel tasks)
    const [[mentalRow]] = await pool.query(`
      SELECT ROUND(AVG(p.value), 1) as avg_mental
      FROM performances p
      JOIN tasks t ON p.task_id = t.id
      WHERE t.type = 'apel'
    `);

    // Discipline rate — % of students with no point deductions (pelanggaran)
    const [[disciplineRow]] = await pool.query(`
      SELECT ROUND(
        (1 - COUNT(DISTINCT student_id) / (SELECT COUNT(*) FROM students)) * 100, 1
      ) as discipline_rate
      FROM gived_tasks
      WHERE rates IS NOT NULL AND rates < 70
    `);

    const statsCards = [
      { data_name: 'Total Siswa', data: totalStudents.toString(), icon: 'groups' },
      { data_name: 'Akademik Rata-rata', data: (academicRow.avg_academic || 0).toString(), icon: 'school' },
      { data_name: 'Mental Rata-rata', data: (mentalRow.avg_mental || 0).toString(), icon: 'psychology' },
      { data_name: 'Tingkat Disiplin', data: `${disciplineRow.discipline_rate || 100}%`, icon: 'verified_user' },
      { data_name: 'Tugas Aktif', data: activeTasks.toString(), icon: 'pending_actions' },
    ];

    // ── Academic Chart (sprint, last 6 months) ───────────────────────────────
    const [academicChartRows] = await pool.query(`
      SELECT
        DATE_FORMAT(p.created_at, '%Y-%m') as month_key,
        MONTH(p.created_at) as month_num,
        ROUND(AVG(p.value), 1) as avg_value
      FROM performances p
      JOIN tasks t ON p.task_id = t.id
      WHERE t.type = 'sprint'
        AND p.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month_key, month_num
      ORDER BY month_key ASC
      LIMIT 6
    `);

    const academicChart = academicChartRows.map(r => ({
      month: MONTHS_ID[r.month_num - 1],
      value: r.avg_value || 0,
    }));

    // ── Mental Chart (apel, last 6 months) ───────────────────────────────────
    const [mentalChartRows] = await pool.query(`
      SELECT
        DATE_FORMAT(p.created_at, '%Y-%m') as month_key,
        MONTH(p.created_at) as month_num,
        ROUND(AVG(p.value), 1) as avg_value
      FROM performances p
      JOIN tasks t ON p.task_id = t.id
      WHERE t.type = 'apel'
        AND p.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month_key, month_num
      ORDER BY month_key ASC
      LIMIT 6
    `);

    const mentalChart = mentalChartRows.map(r => ({
      month: MONTHS_ID[r.month_num - 1],
      value: r.avg_value || 0,
    }));

    // ── Attendance ───────────────────────────────────────────────────────────
    const [[attendanceRow]] = await pool.query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN gt.status = 'completed' THEN 1 ELSE 0 END) as hadir,
        SUM(CASE WHEN gt.status = 'pending' THEN 1 ELSE 0 END) as alpa
      FROM gived_tasks gt
      JOIN tasks t ON gt.task_id = t.id
      WHERE t.type = 'apel'
    `);

    const total = attendanceRow.total || 1;
    const hadir = attendanceRow.hadir || 0;
    const alpa = attendanceRow.alpa || 0;
    const izin = Math.max(0, total - hadir - alpa);

    const attendance = [
      { data_name: 'Hadir', data: `${Math.round((hadir / total) * 100)}%` },
      { data_name: 'Izin/Sakit', data: `${Math.round((izin / total) * 100)}%` },
      { data_name: 'Tanpa Keterangan', data: `${Math.round((alpa / total) * 100)}%` },
    ];

    // ── Discipline Violations ────────────────────────────────────────────────
    // Use points table categories as proxy for severity levels
    const [[disciplineStats]] = await pool.query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN points <= -10 THEN 1 ELSE 0 END) as berat,
        SUM(CASE WHEN points > -10 AND points <= -5 THEN 1 ELSE 0 END) as sedang,
        SUM(CASE WHEN points > -5 THEN 1 ELSE 0 END) as ringan
      FROM points
      WHERE category = 'Pelanggaran'
    `);

    const totalViolations = disciplineStats.total || 0;
    const disciplineViolations = {
      total: totalViolations,
      breakdown: [
        {
          data_name: 'Berat',
          data: totalViolations > 0 ? `${Math.round((disciplineStats.berat / totalViolations) * 100)}%` : '0%',
          count: disciplineStats.berat || 0,
        },
        {
          data_name: 'Sedang',
          data: totalViolations > 0 ? `${Math.round((disciplineStats.sedang / totalViolations) * 100)}%` : '0%',
          count: disciplineStats.sedang || 0,
        },
        {
          data_name: 'Ringan',
          data: totalViolations > 0 ? `${Math.round((disciplineStats.ringan / totalViolations) * 100)}%` : '0%',
          count: disciplineStats.ringan || 0,
        },
      ],
    };

    // ── Low Score Students ───────────────────────────────────────────────────
    const [lowScoreRows] = await pool.query(`
      SELECT
        u.name,
        g.name as regiment,
        ROUND(AVG(CASE WHEN t.type = 'sprint' THEN p.value END), 1) as academic,
        ROUND(AVG(CASE WHEN t.type = 'apel'   THEN p.value END), 1) as mental
      FROM performances p
      JOIN students s ON p.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN tasks t ON p.task_id = t.id
      JOIN \`groups\` g ON s.group_id = g.id
      GROUP BY p.student_id, u.name, g.name
      HAVING academic < 75 OR mental < 75
      ORDER BY LEAST(COALESCE(academic, 100), COALESCE(mental, 100)) ASC
      LIMIT 5
    `);

    const lowScoreStudents = lowScoreRows.map(row => ({
      name: row.name,
      initials: row.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase(),
      regiment: row.regiment,
      academic: (row.academic || 0).toString(),
      mental: (row.mental || 0).toString(),
    }));

    // ── Recent Activity ──────────────────────────────────────────────────────
    const [activityRows] = await pool.query(`
      SELECT la.action_label, la.activity, la.modul, la.created_at, u.name
      FROM log_activity la
      JOIN users u ON la.user_id = u.id
      ORDER BY la.created_at DESC
      LIMIT 4
    `);

    function timeAgo(date) {
      const diffMs = Date.now() - new Date(date).getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 60) return `${diffMin} Menit Lalu`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour} Jam Lalu`;
      const diffDay = Math.floor(diffHour / 24);
      if (diffDay === 1) return 'Kemarin';
      return `${diffDay} Hari Lalu`;
    }

    const recentActivity = activityRows.map(row => ({
      title: row.action_label || 'Aktivitas Sistem',
      desc: row.activity,
      modul: row.modul || 'Sistem',
      time: timeAgo(row.created_at),
      user: row.name,
    }));

    res.status(200).json({
      status: 'success',
      data: {
        statsCards,
        academicChart,
        mentalChart,
        attendance,
        disciplineViolations,
        lowScoreStudents,
        recentActivity,
      },
    });

  } catch (err) {
    next(err);
  }
};

// GET /api/v1/web-specific/profile — returns the logged-in user's profile
export const getEditProfileData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Try to fetch role-specific detail (nrp, rank, position) from teachers/directors
    let roleDetail = null;

    if (user.role === 'teacher') {
      const [rows] = await pool.query(
        "SELECT nrp, `rank`, `position` FROM teachers WHERE user_id = ?", [userId]
      );
      roleDetail = rows[0] || null;
    } else if (user.role === 'director') {
      const [rows] = await pool.query(
        "SELECT nrp, `position`, unit FROM directors WHERE user_id = ?", [userId]
      );
      roleDetail = rows[0] || null;
    } else if (user.role === 'students') {
      const [rows] = await pool.query(
        "SELECT nip, grade FROM students WHERE user_id = ?", [userId]
      );
      roleDetail = rows[0] || null;
    }

    res.status(200).json({
      status: "success",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone_number: user.phone_number || null,
        address: user.address || null,
        birth_date: user.birth_date || null,
        nrp: roleDetail?.nrp || roleDetail?.nip || null,
        rank: roleDetail?.rank || null,
        position: roleDetail?.position || null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/web-specific/profile — update profile info and/or change password
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, email, phone_number, address, current_password, new_password, confirm_password } = req.body;

    // ── Update basic info ────────────────────────────────────────────────────
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone_number !== undefined) updateFields.phone_number = phone_number;
    if (address !== undefined) updateFields.address = address;

    if (Object.keys(updateFields).length > 0) {
      await User.update(userId, updateFields);
    }

    // ── Change password (optional) ───────────────────────────────────────────
    if (current_password || new_password) {
      if (!current_password || !new_password || !confirm_password) {
        return res.status(400).json({ error: "Semua kolom kata sandi (saat ini, baru, konfirmasi) wajib diisi." });
      }

      if (new_password !== confirm_password) {
        return res.status(400).json({ error: "Kata sandi baru dan konfirmasi tidak cocok." });
      }

      if (new_password.length < 8) {
        return res.status(400).json({ error: "Kata sandi baru minimal 8 karakter." });
      }

      // Fetch user with password hash
      const [rows] = await pool.query("SELECT password FROM users WHERE id = ?", [userId]);
      const storedHash = rows[0]?.password;

      const isValid = await bcrypt.compare(current_password, storedHash);
      if (!isValid) {
        return res.status(401).json({ error: "Kata sandi saat ini salah." });
      }

      const newHash = await bcrypt.hash(new_password, 12);
      await pool.query("UPDATE users SET password = ? WHERE id = ?", [newHash, userId]);
    }

    const updatedUser = await User.findById(userId);

    res.status(200).json({
      status: "success",
      message: "Profil berhasil diperbarui.",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone_number: updatedUser.phone_number || null,
        address: updatedUser.address || null,
      },
    });
  } catch (err) {
    next(err);
  }
};
