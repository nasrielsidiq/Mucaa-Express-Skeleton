import express from "express";
import * as webSpecificController from "../controllers/web_specific.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/web-specific/task-management:
 *   get:
 *     tags:
 *       - Web Specific
 *     summary: Get task management dashboard data
 *     description: Returns aggregated task statistics and recent tasks specifically formatted for the task management dashboard.
 *     responses:
 *       200:
 *         description: Successfully retrieved task management data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     tasks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             format: int64
 *                           title:
 *                             type: string
 *                           subject:
 *                             type: string
 *                           groups:
 *                             type: array
 *                             items:
 *                               type: string
 *                           deadline:
 *                             type: string
 *                           deadlineNote:
 *                             type: string
 *                           status:
 *                             type: string
 *                     summaryCards:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           data_name:
 *                             type: string
 *                           data:
 *                             type: string
 *       500:
 *         description: Internal server error
 */
router.get("/task-management", protect, webSpecificController.getTaskManagementData);

/**
 * @swagger
 * /api/v1/web-specific/roll-call-management:
 *   get:
 *     tags:
 *       - Web Specific
 *     summary: Get roll call management dashboard data
 *     description: Returns attendance statistics, weekly charts, and student presence lists suitable for the roll call dashboard.
 *     responses:
 *       200:
 *         description: Successfully retrieved roll call management data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     kpiCards:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           data_name:
 *                             type: string
 *                           data:
 *                             type: string
 *                           suffix:
 *                             type: string
 *                     chartBars:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           data_name:
 *                             type: string
 *                           target:
 *                             type: string
 *                           data:
 *                             type: string
 *                     students:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           nrp:
 *                             type: string
 *                           pokjar:
 *                             type: string
 *                           status:
 *                             type: string
 *                           scanTime:
 *                             type: string
 *                             nullable: true
 *                           avatar:
 *                             type: string
 *       500:
 *         description: Internal server error
 */
router.get("/roll-call-management", protect, webSpecificController.getRollCallManagementData);

/**
 * @swagger
 * /api/v1/web-specific/activity-log:
 *   get:
 *     tags:
 *       - Web Specific
 *     summary: Get activity log dashboard data
 *     description: Returns paginated activity logs and summary stats for the ActivityLogPage. Supports optional filtering.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: modul
 *         schema:
 *           type: string
 *         description: Filter by module name
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter start date (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter end date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successfully retrieved activity log data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     summaryCards:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           data_name:
 *                             type: string
 *                           data:
 *                             type: string
 *                           trend:
 *                             type: string
 *                           trendNote:
 *                             type: string
 *                     logs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           no:
 *                             type: string
 *                           user:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           actionLabel:
 *                             type: string
 *                           actionNote:
 *                             type: string
 *                           modul:
 *                             type: string
 *                           time:
 *                             type: string
 *                           date:
 *                             type: string
 *                           ip:
 *                             type: string
 *                     modulOptions:
 *                       type: array
 *                       items:
 *                         type: string
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       500:
 *         description: Internal server error
 */
router.get("/activity-log", protect, webSpecificController.getActivityLogData);

/**
 * @swagger
 * /api/v1/web-specific/dashboard:
 *   get:
 *     tags:
 *       - Web Specific
 *     summary: Get main dashboard data
 *     description: Returns all aggregated data needed for the main dashboard including stats cards, chart trends, attendance, discipline violations, low-score students, and recent activity.
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     statsCards:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           data_name:
 *                             type: string
 *                           data:
 *                             type: string
 *                           icon:
 *                             type: string
 *                     academicChart:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: string
 *                           value:
 *                             type: number
 *                     mentalChart:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: string
 *                           value:
 *                             type: number
 *                     attendance:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           data_name:
 *                             type: string
 *                           data:
 *                             type: string
 *                     disciplineViolations:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         breakdown:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               data_name:
 *                                 type: string
 *                               data:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                     lowScoreStudents:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           initials:
 *                             type: string
 *                           regiment:
 *                             type: string
 *                           academic:
 *                             type: string
 *                           mental:
 *                             type: string
 *                     recentActivity:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           desc:
 *                             type: string
 *                           modul:
 *                             type: string
 *                           time:
 *                             type: string
 *                           user:
 *                             type: string
 *       500:
 *         description: Internal server error
 */
router.get("/dashboard", protect, webSpecificController.getDashboardData);

/**
 * @swagger
 * /api/v1/web-specific/profile:
 *   get:
 *     tags:
 *       - Web Specific
 *     summary: Get logged-in user's profile for the Edit Profile page
 *     description: Returns the authenticated user's profile data including role-specific fields (NRP, rank, position).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     phone_number:
 *                       type: string
 *                       nullable: true
 *                     address:
 *                       type: string
 *                       nullable: true
 *                     birth_date:
 *                       type: string
 *                       nullable: true
 *                     nrp:
 *                       type: string
 *                       nullable: true
 *                     rank:
 *                       type: string
 *                       nullable: true
 *                     position:
 *                       type: string
 *                       nullable: true
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/profile", protect, webSpecificController.getEditProfileData);

/**
 * @swagger
 * /api/v1/web-specific/profile:
 *   put:
 *     tags:
 *       - Web Specific
 *     summary: Update logged-in user's profile
 *     description: Update basic info (name, email, phone, address) and optionally change password in one request.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               address:
 *                 type: string
 *               current_password:
 *                 type: string
 *                 description: Required only if changing password
 *               new_password:
 *                 type: string
 *                 description: Required only if changing password (min 8 chars)
 *               confirm_password:
 *                 type: string
 *                 description: Must match new_password
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error (mismatched passwords, missing fields)
 *       401:
 *         description: Current password is incorrect
 *       500:
 *         description: Internal server error
 */
router.put("/profile", protect, webSpecificController.updateProfile);

export default router;
