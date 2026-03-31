import { Router } from "express";
import {
  getAllActivities,
  getActivityById,
  getActivitiesByUserId,
  getRecentActivities,
  getActivitiesByDateRange,
  createActivity,
  deleteOldActivities,
  deleteActivitiesByUserId,
  exportCSV,
  exportTXT,
  clearActivities,
} from "../controllers/log_activity.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/log-activities:
 *   get:
 *     tags:
 *       - Activity Logs
 *     summary: Get all activities
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LogActivity'
 */
router.get("/", protect, getAllActivities);

/**
 * @swagger
 * /api/v1/log-activities/recent:
 *   get:
 *     tags:
 *       - Activity Logs
 *     summary: Get recent activities (last 24 hours)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LogActivity'
 */
router.get("/recent", protect, getRecentActivities);

/**
 * @swagger
 * /api/v1/log-activities/{id}:
 *   get:
 *     tags:
 *       - Activity Logs
 *     summary: Get activity by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Activity retrieved successfully
 *       404:
 *         description: Activity not found
 */
router.get("/:id", protect, getActivityById);

/**
 * @swagger
 * /api/v1/log-activities/user/{userId}:
 *   get:
 *     tags:
 *       - Activity Logs
 *     summary: Get activities by user ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Activities retrieved successfully
 *       404:
 *         description: No activities found for this user
 */
router.get("/user/:userId", protect, getActivitiesByUserId);

/**
 * @swagger
 * /api/v1/log-activities:
 *   post:
 *     tags:
 *       - Activity Logs
 *     summary: Create a new activity log
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - action
 *             properties:
 *               user_id:
 *                 type: integer
 *               action:
 *                 type: string
 *               table_name:
 *                 type: string
 *               record_id:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Activity log created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", protect, createActivity);

/**
 * @swagger
 * /api/v1/log-activities/date-range:
 *   post:
 *     tags:
 *       - Activity Logs
 *     summary: Get activities within a date range
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - start_date
 *               - end_date
 *             properties:
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Activities retrieved successfully
 *       400:
 *         description: Invalid date range
 */
router.post("/date-range", protect, getActivitiesByDateRange);

/**
 * @swagger
 * /api/v1/log-activities/old:
 *   delete:
 *     tags:
 *       - Activity Logs
 *     summary: Delete activities older than 30 days
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Old activities deleted successfully
 */
router.delete("/old", protect, restrictTo("admin"), deleteOldActivities);

/**
 * @swagger
 * /api/v1/log-activities/user/{userId}:
 *   delete:
 *     tags:
 *       - Activity Logs
 *     summary: Delete all activities by user ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Activities deleted successfully
 */
router.delete("/user/:userId", protect, restrictTo("admin"), deleteActivitiesByUserId);

/**
 * @swagger
 * /api/v1/log-activities/export/csv:
 *   get:
 *     tags:
 *       - Activity Logs
 *     summary: Export all activities as CSV
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/export/csv", protect, restrictTo("admin"), exportCSV);

/**
 * @swagger
 * /api/v1/log-activities/export/txt:
 *   get:
 *     tags:
 *       - Activity Logs
 *     summary: Export all activities as TXT
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: TXT file download
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/export/txt", protect, restrictTo("admin"), exportTXT);

/**
 * @swagger
 * /api/v1/log-activities/clear:
 *   delete:
 *     tags:
 *       - Activity Logs
 *     summary: Clear all activity logs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All activity logs cleared
 */
router.delete("/clear", protect, restrictTo("admin"), clearActivities);

export default router;
