import { Router } from "express";
import {
  getAllPoints,
  getPointById,
  getPointsByCategory,
  createPoint,
  updatePoint,
  deletePoint,
} from "../controllers/point.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/points:
 *   get:
 *     tags:
 *       - Points
 *     summary: Get all points
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all points
 */
router.get("/", protect, getAllPoints);

/**
 * @swagger
 * /api/v1/points/category/{category}:
 *   get:
 *     tags:
 *       - Points
 *     summary: Get points by category (Prestasi/Pelanggaran)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of points by category
 */
router.get("/category/:category", protect, getPointsByCategory);

/**
 * @swagger
 * /api/v1/points/{id}:
 *   get:
 *     tags:
 *       - Points
 *     summary: Get point by ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Point retrieved successfully
 *       404:
 *         description: Point not found
 */
router.get("/:id", protect, getPointById);

/**
 * @swagger
 * /api/v1/points:
 *   post:
 *     tags:
 *       - Points
 *     summary: Create a new point
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Point created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", protect, restrictTo("admin"), createPoint);

/**
 * @swagger
 * /api/v1/points/{id}:
 *   put:
 *     tags:
 *       - Points
 *     summary: Update point
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Point updated successfully
 *       404:
 *         description: Point not found
 */
router.put("/:id", protect, restrictTo("admin"), updatePoint);

/**
 * @swagger
 * /api/v1/points/{id}:
 *   delete:
 *     tags:
 *       - Points
 *     summary: Delete point
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Point deleted successfully
 *       404:
 *         description: Point not found
 */
router.delete("/:id", protect, restrictTo("admin"), deletePoint);

export default router;
