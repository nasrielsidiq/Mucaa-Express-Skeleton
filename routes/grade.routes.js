import { Router } from "express";
import {
  getAllGrades,
  getGradeById,
  getGradesByStudentId,
  getGradesByTeacherId,
  createGrade,
  updateGrade,
  deleteGrade,
} from "../controllers/grade.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/grades:
 *   get:
 *     tags:
 *       - Grades
 *     summary: Get all grades
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all grades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grade'
 */
router.get("/", protect, getAllGrades);

/**
 * @swagger
 * /api/v1/grades/student/{studentId}:
 *   get:
 *     tags:
 *       - Grades
 *     summary: Get grades by student ID
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
 *         description: Grades retrieved successfully
 *       404:
 *         description: No grades found for this student
 */
router.get("/student/:studentId", protect, getGradesByStudentId);

/**
 * @swagger
 * /api/v1/grades/teacher/{teacherId}:
 *   get:
 *     tags:
 *       - Grades
 *     summary: Get grades by teacher ID
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
 *         description: Grades retrieved successfully
 *       404:
 *         description: No grades found for this teacher
 */
router.get("/teacher/:teacherId", protect, getGradesByTeacherId);

/**
 * @swagger
 * /api/v1/grades/{id}:
 *   get:
 *     tags:
 *       - Grades
 *     summary: Get grade by ID
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
 *         description: Grade retrieved successfully
 *       404:
 *         description: Grade not found
 */
router.get("/:id", protect, getGradeById);

/**
 * @swagger
 * /api/v1/grades:
 *   post:
 *     tags:
 *       - Grades
 *     summary: Create a new grade
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
 *               - grade_category_id
 *               - grade
 *             properties:
 *               student_id:
 *                 type: integer
 *               teacher_id:
 *                 type: integer
 *               grade_category_id:
 *                 type: integer
 *               grade:
 *                 type: number
 *     responses:
 *       201:
 *         description: Grade created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", protect, restrictTo("admin", "teacher"), createGrade);

/**
 * @swagger
 * /api/v1/grades/{id}:
 *   put:
 *     tags:
 *       - Grades
 *     summary: Update grade
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
 *                 type: number
 *               grade_category_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Grade updated successfully
 *       404:
 *         description: Grade not found
 */
router.put("/:id", protect, restrictTo("admin", "teacher"), updateGrade);

/**
 * @swagger
 * /api/v1/grades/{id}:
 *   delete:
 *     tags:
 *       - Grades
 *     summary: Delete grade
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
 *         description: Grade deleted successfully
 *       404:
 *         description: Grade not found
 */
router.delete("/:id", protect, restrictTo("admin", "teacher"), deleteGrade);

export default router;
