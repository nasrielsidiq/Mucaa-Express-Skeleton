import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  getTasksByTeacherId,
  getTasksByStatus,
  getTasksByType,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get all tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get("/", protect, getAllTasks);

/**
 * @swagger
 * /api/v1/tasks/teacher/{teacherId}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get tasks by teacher ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       404:
 *         description: No tasks found for this teacher
 */
router.get("/teacher/:teacherId", protect, getTasksByTeacherId);

/**
 * @swagger
 * /api/v1/tasks/status/{status}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get tasks by status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, completed]
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       404:
 *         description: No tasks found with this status
 */
router.get("/status/:status", protect, getTasksByStatus);

/**
 * @swagger
 * /api/v1/tasks/type/{type}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get tasks by type
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [sprint, apel]
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       404:
 *         description: No tasks found with this type
 */
router.get("/type/:type", protect, getTasksByType);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get task by ID
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
 *         description: Task retrieved successfully
 *       404:
 *         description: Task not found
 */
router.get("/:id", protect, getTaskById);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create a new task
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacher_id
 *               - title
 *             properties:
 *               teacher_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [sprint, apel]
 *               start_date:
 *                 type: string
 *                 format: date
 *               due_date:
 *                 type: string
 *                 format: date
 *               start_time:
 *                 type: string
 *                 format: time
 *               due_time:
 *                 type: string
 *                 format: time
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", protect, restrictTo("admin", "teacher"), createTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     tags:
 *       - Tasks
 *     summary: Update task
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [sprint, apel]
 *               start_date:
 *                 type: string
 *                 format: date
 *               due_date:
 *                 type: string
 *                 format: date
 *               start_time:
 *                 type: string
 *                 format: time
 *               due_time:
 *                 type: string
 *                 format: time
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
router.put("/:id", protect, restrictTo("admin", "teacher"), updateTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete task
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
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete("/:id", protect, restrictTo("admin", "teacher"), deleteTask);

export default router;
