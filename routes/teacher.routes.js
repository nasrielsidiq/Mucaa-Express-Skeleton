import { Router } from "express";
import {
  getAllTeachers,
  getTeacherById,
  getTeacherByUserId,
  getTeacherByNrp,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/teachers:
 *   get:
 *     tags:
 *       - Teachers
 *     summary: Get all teachers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */
router.get("/", protect, getAllTeachers);

/**
 * @swagger
 * /api/v1/teachers/{id}:
 *   get:
 *     tags:
 *       - Teachers
 *     summary: Get teacher by ID
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
 *         description: Teacher retrieved successfully
 *       404:
 *         description: Teacher not found
 */
router.get("/:id", protect, getTeacherById);

/**
 * @swagger
 * /api/v1/teachers/user/{userId}:
 *   get:
 *     tags:
 *       - Teachers
 *     summary: Get teacher by user ID
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
 *         description: Teacher retrieved successfully
 *       404:
 *         description: Teacher not found
 */
router.get("/user/:userId", protect, getTeacherByUserId);

/**
 * @swagger
 * /api/v1/teachers/nrp/{nrp}:
 *   get:
 *     tags:
 *       - Teachers
 *     summary: Get teacher by NRP (Employee ID)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nrp
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher retrieved successfully
 *       404:
 *         description: Teacher not found
 */
router.get("/nrp/:nrp", protect, getTeacherByNrp);

/**
 * @swagger
 * /api/v1/teachers:
 *   post:
 *     tags:
 *       - Teachers
 *     summary: Create a new teacher
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
 *               - nrp
 *             properties:
 *               user_id:
 *                 type: integer
 *               nrp:
 *                 type: string
 *               rank:
 *                 type: string
 *               position:
 *                 type: string
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", protect, restrictTo("admin"), createTeacher);

/**
 * @swagger
 * /api/v1/teachers/{id}:
 *   put:
 *     tags:
 *       - Teachers
 *     summary: Update teacher
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
 *               rank:
 *                 type: string
 *               position:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 *       404:
 *         description: Teacher not found
 */
router.put("/:id", protect, restrictTo("admin"), updateTeacher);

/**
 * @swagger
 * /api/v1/teachers/{id}:
 *   delete:
 *     tags:
 *       - Teachers
 *     summary: Delete teacher
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
 *         description: Teacher deleted successfully
 *       404:
 *         description: Teacher not found
 */
router.delete("/:id", protect, restrictTo("admin"), deleteTeacher);

export default router;
