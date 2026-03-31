import LogActivity from "../models/log_activity.model.js";

// GET all activities
export const getAllActivities = async (req, res, next) => {
  try {
    const activities = await LogActivity.findAll();
    res.status(200).json({
      status: "success",
      data: activities,
    });
  } catch (err) {
    next(err);
  }
};

// GET activity by ID
export const getActivityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const activity = await LogActivity.findById(id);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json({
      status: "success",
      data: activity,
    });
  } catch (err) {
    next(err);
  }
};

// GET activities by user ID
export const getActivitiesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const activities = await LogActivity.findByUserId(userId);

    res.status(200).json({
      status: "success",
      data: activities,
    });
  } catch (err) {
    next(err);
  }
};

// GET recent activities
export const getRecentActivities = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const activities = await LogActivity.findRecent(parseInt(limit));

    res.status(200).json({
      status: "success",
      data: activities,
    });
  } catch (err) {
    next(err);
  }
};

// GET activities by date range
export const getActivitiesByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Missing startDate or endDate" });
    }

    const activities = await LogActivity.findByDateRange(startDate, endDate);

    res.status(200).json({
      status: "success",
      data: activities,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE log activity
export const createActivity = async (req, res, next) => {
  try {
    const { user_id, activity } = req.body;

    if (!user_id || !activity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newActivity = await LogActivity.create({ user_id, activity });

    res.status(201).json({
      status: "success",
      data: newActivity,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE activities older than specified days
export const deleteOldActivities = async (req, res, next) => {
  try {
    const { days = 90 } = req.body;
    const result = await LogActivity.deleteOlderThan(days);

    res.status(200).json({
      status: "success",
      message: `Deleted ${result} activities older than ${days} days`,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE activities by user ID
export const deleteActivitiesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await LogActivity.deleteByUserId(userId);

    if (!result) {
      return res.status(404).json({ error: "No activities found for this user" });
    }

    res.status(200).json({
      status: "success",
      message: "Activities deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// EXPORT activities as CSV
export const exportCSV = async (req, res, next) => {
  try {
    const activities = await LogActivity.findAll();
    
    if (activities.length === 0) {
      return res.status(404).json({ error: "No activities to export" });
    }

    let csvContent = "ID,User ID,Name,Role,Action Label,Activity,Modul,IP Address,Created At\n";
    activities.forEach(log => {
      const escapedActivity = `"${(log.activity || '').replace(/"/g, '""')}"`;
      csvContent += `${log.id},${log.user_id},"${log.name}","${log.role}","${log.action_label}",${escapedActivity},"${log.modul}","${log.ip_address}","${new Date(log.created_at).toISOString()}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('log_activities_backup.csv');
    return res.send(csvContent);
  } catch (err) {
    next(err);
  }
};

// EXPORT activities as TXT
export const exportTXT = async (req, res, next) => {
  try {
    const activities = await LogActivity.findAll();
    
    if (activities.length === 0) {
      return res.status(404).json({ error: "No activities to export" });
    }

    let txtContent = "--- LOG ACTIVITIES BACKUP ---\n\n";
    activities.forEach(log => {
      txtContent += `[${new Date(log.created_at).toLocaleString()}] - User: ${log.name} (${log.role})\n`;
      txtContent += `Module: ${log.modul} | Action: ${log.action_label} | IP: ${log.ip_address || 'N/A'}\n`;
      txtContent += `Note: ${log.activity}\n`;
      txtContent += `----------------------------------------\n`;
    });

    res.header('Content-Type', 'text/plain');
    res.attachment('log_activities_backup.txt');
    return res.send(txtContent);
  } catch (err) {
    next(err);
  }
};

// CLEAR all activities
export const clearActivities = async (req, res, next) => {
  try {
    await LogActivity.clearAll();
    res.status(200).json({
      status: "success",
      message: "All activity logs have been cleared successfully."
    });
  } catch (err) {
    next(err);
  }
};
