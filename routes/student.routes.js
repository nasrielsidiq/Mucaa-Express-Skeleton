import { Router } from "express";
import {
  getAllStudents,
  getStudentById,
  getStudentByUserId,
  getStudentByNip,
  getStudentsByGroupId,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/students:
 *   get:
 *     tags:
 *       - Students
 *     summary: Get all students
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get("/", protect, getAllStudents);

/**
 * @swagger
 * /api/v1/students/user/{userId}:
 *   get:
 *     tags:
 *       - Students
 *     summary: Get student by user ID
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
 *         description: Student retrieved successfully
 *       404:
 *         description: Student not found
 */
router.get("/user/:userId", protect, getStudentByUserId);

/**
 * @swagger
 * /api/v1/students/nip/{nip}:
 *   get:
 *     tags:
 *       - Students
 *     summary: Get student by NIP (Student ID)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nip
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student retrieved successfully
 *       404:
 *         description: Student not found
 */
router.get("/nip/:nip", protect, getStudentByNip);

/**
 * @swagger
 * /api/v1/students/group/{groupId}:
 *   get:
 *     tags:
 *       - Students
 *     summary: Get students by group ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 *       404:
 *         description: No students found in this group
 */
router.get("/group/:groupId", protect, getStudentsByGroupId);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   get:
 *     tags:
 *       - Students
 *     summary: Get student by ID
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
 *         description: Student retrieved successfully
 *       404:
 *         description: Student not found
 */
router.get("/:id", protect, getStudentById);

/**
 * @swagger
 * /api/v1/students:
 *   post:
 *     tags:
 *       - Students
 *     summary: Create a new student
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
 *               - nip
 *               - group_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               nip:
 *                 type: string
 *               group_id:
 *                 type: integer
 *               grade:
 *                 type: string
 *               religion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", protect, restrictTo("admin"), createStudent);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   put:
 *     tags:
 *       - Students
 *     summary: Update student
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
 *               group_id:
 *                 type: integer
 *               grade:
 *                 type: string
 *               religion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       404:
 *         description: Student not found
 */
router.put("/:id", protect, restrictTo("admin"), updateStudent);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   delete:
 *     tags:
 *       - Students
 *     summary: Delete student
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
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 */
router.delete("/:id", protect, restrictTo("admin"), deleteStudent);

export default router;
