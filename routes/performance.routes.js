import express from "express";
import {
  getPerformances,
  getPerformanceById,
  getPerformanceByStudentId,
  getPerformanceByTeacherId,
  getPerformanceByTaskId,
  getPerformanceByCategoryId,
  createPerformance,
  updatePerformance,
  deletePerformance,
} from "../controllers/performance.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/performances:
 *   get:
 *     tags:
 *       - Performances
 *     summary: Get all performances
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all performances
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Performance'
 */
router.get("/", protect, getPerformances);

/**
 * @swagger
 * /api/v1/performances/{id}:
 *   get:
 *     tags:
 *       - Performances
 *     summary: Get performance by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/:id", protect, getPerformanceById);

/**
 * @swagger
 * /api/v1/performances/student/{studentId}:
 *   get:
 *     tags:
 *       - Performances
 *     summary: Get performances by student ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/student/:studentId", protect, getPerformanceByStudentId);

/**
 * @swagger
 * /api/v1/performances/teacher/{teacherId}:
 *   get:
 *     tags:
 *       - Performances
 *     summary: Get performances by teacher ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/teacher/:teacherId", protect, getPerformanceByTeacherId);

/**
 * @swagger
 * /api/v1/performances/task/{taskId}:
 *   get:
 *     tags:
 *       - Performances
 *     summary: Get performances by task ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/task/:taskId", protect, getPerformanceByTaskId);

/**
 * @swagger
 * /api/v1/performances/category/{categoryId}:
 *   get:
 *     tags:
 *       - Performances
 *     summary: Get performances by category ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/category/:categoryId", protect, getPerformanceByCategoryId);

/**
 * @swagger
 * /api/v1/performances:
 *   post:
 *     tags:
 *       - Performances
 *     summary: Create a new performance
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - teacher_id
 *               - task_id
 *               - grade
 *             properties:
 *               student_id:
 *                 type: integer
 *               teacher_id:
 *                 type: integer
 *               task_id:
 *                 type: integer
 *               grade_category_id:
 *                 type: integer
 *               grade:
 *                 type: integer
 */
router.post("/", protect, restrictTo("admin", "teacher"), createPerformance);

/**
 * @swagger
 * /api/v1/performances/{id}:
 *   put:
 *     tags:
 *       - Performances
 *     summary: Update performance
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
 *               grade:
 *                 type: string
 *               grade_category_id:
 *                 type: integer
 */
router.put("/:id", protect, restrictTo("admin", "teacher"), updatePerformance);

/**
 * @swagger
 * /api/v1/performances/{id}:
 *   delete:
 *     tags:
 *       - Performances
 *     summary: Delete performance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete("/:id", protect, restrictTo("admin", "teacher"), deletePerformance);

export default router;
