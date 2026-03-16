import { Router } from "express";
import {
  getAllDirectors,
  getDirectorById,
  getDirectorByUserId,
  createDirector,
  updateDirector,
  deleteDirector,
} from "../controllers/director.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/directors:
 *   get:
 *     tags:
 *       - Directors
 *     summary: Get all directors
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all directors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Director'
 */
router.get("/", protect, getAllDirectors);

/**
 * @swagger
 * /api/v1/directors/{id}:
 *   get:
 *     tags:
 *       - Directors
 *     summary: Get director by ID
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
 *         description: Director retrieved successfully
 *       404:
 *         description: Director not found
 */
router.get("/:id", protect, getDirectorById);

/**
 * @swagger
 * /api/v1/directors/user/{userId}:
 *   get:
 *     tags:
 *       - Directors
 *     summary: Get director by user ID
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
 *         description: Director retrieved successfully
 *       404:
 *         description: Director not found
 */
router.get("/user/:userId", protect, getDirectorByUserId);

/**
 * @swagger
 * /api/v1/directors:
 *   post:
 *     tags:
 *       - Directors
 *     summary: Create a new director
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
 *               position:
 *                 type: string
 *               unit:
 *                 type: string
 *     responses:
 *       201:
 *         description: Director created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", protect, restrictTo("admin"), createDirector);

/**
 * @swagger
 * /api/v1/directors/{id}:
 *   put:
 *     tags:
 *       - Directors
 *     summary: Update director
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
 *               position:
 *                 type: string
 *               unit:
 *                 type: string
 *     responses:
 *       200:
 *         description: Director updated successfully
 *       404:
 *         description: Director not found
 */
router.put("/:id", protect, restrictTo("admin"), updateDirector);

/**
 * @swagger
 * /api/v1/directors/{id}:
 *   delete:
 *     tags:
 *       - Directors
 *     summary: Delete director
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
 *         description: Director deleted successfully
 *       404:
 *         description: Director not found
 */
router.delete("/:id", protect, restrictTo("admin"), deleteDirector);

export default router;
