import { Router } from "express";
import {
  getAllGivedTasks,
  getGivedTaskById,
  getGivedTasksByTaskId,
  getGivedTasksByStudentId,
  getGivedTasksByStatus,
  createGivedTask,
  updateGivedTask,
  deleteGivedTask,
} from "../controllers/gived_task.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/gived-tasks:
 *   get:
 *     tags:
 *       - Given Tasks
 *     summary: Get all given tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all given tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GivenTask'
 */
router.get("/", protect, getAllGivedTasks);

/**
 * @swagger
 * /api/v1/gived-tasks/task/{taskId}:
 *   get:
 *     tags:
 *       - Given Tasks
 *     summary: Get given tasks by task ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Given tasks retrieved successfully
 *       404:
 *         description: No given tasks found for this task
 */
router.get("/task/:taskId", protect, getGivedTasksByTaskId);

/**
 * @swagger
 * /api/v1/gived-tasks/student/{studentId}:
 *   get:
 *     tags:
 *       - Given Tasks
 *     summary: Get given tasks by student ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Given tasks retrieved successfully
 *       404:
 *         description: No given tasks found for this student
 */
router.get("/student/:studentId", protect, getGivedTasksByStudentId);

/**
 * @swagger
 * /api/v1/gived-tasks/status/{status}:
 *   get:
 *     tags:
 *       - Given Tasks
 *     summary: Get given tasks by status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, submitted, completed]
 *     responses:
 *       200:
 *         description: Given tasks retrieved successfully
 *       404:
 *         description: No given tasks found with this status
 */
router.get("/status/:status", protect, getGivedTasksByStatus);

/**
 * @swagger
 * /api/v1/gived-tasks/{id}:
 *   get:
 *     tags:
 *       - Given Tasks
 *     summary: Get given task by ID
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
 *         description: Given task retrieved successfully
 *       404:
 *         description: Given task not found
 */
router.get("/:id", protect, getGivedTaskById);

/**
 * @swagger
 * /api/v1/gived-tasks:
 *   post:
 *     tags:
 *       - Given Tasks
 *     summary: Create a new given task
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task_id
 *               - student_id
 *             properties:
 *               task_id:
 *                 type: integer
 *               student_id:
 *                 type: integer
 *               filepath:
 *                 type: string
 *               rates:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [pending, submitted, completed]
 *     responses:
 *       201:
 *         description: Given task created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", protect, restrictTo("admin", "teacher"), createGivedTask);

/**
 * @swagger
 * /api/v1/gived-tasks/{id}:
 *   put:
 *     tags:
 *       - Given Tasks
 *     summary: Update given task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filepath:
 *                 type: string
 *               rates:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [pending, submitted, completed]
 *     responses:
 *       200:
 *         description: Given task updated successfully
 *       404:
 *         description: Given task not found
 */
router.put("/:id", protect, restrictTo("admin", "teacher"), updateGivedTask);

/**
 * @swagger
 * /api/v1/gived-tasks/{id}:
 *   delete:
 *     tags:
 *       - Given Tasks
 *     summary: Delete given task
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
 *         description: Given task deleted successfully
 *       404:
 *         description: Given task not found
 */
router.delete("/:id", protect, restrictTo("admin", "teacher"), deleteGivedTask);

export default router;
