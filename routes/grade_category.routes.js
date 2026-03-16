import { Router } from "express";
import {
  getAllGradeCategories,
  getGradeCategoryById,
  getGradeCategoryByName,
  getParentCategories,
  getChildCategories,
  createGradeCategory,
  updateGradeCategory,
  deleteGradeCategory,
} from "../controllers/grade_category.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/grade-categories:
 *   get:
 *     tags:
 *       - Grade Categories
 *     summary: Get all grade categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all grade categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GradeCategory'
 */
router.get("/", protect, getAllGradeCategories);

/**
 * @swagger
 * /api/v1/grade-categories/parents:
 *   get:
 *     tags:
 *       - Grade Categories
 *     summary: Get parent grade categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Parent categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GradeCategory'
 */
router.get("/parents", protect, getParentCategories);

/**
 * @swagger
 * /api/v1/grade-categories/children/{categoryId}:
 *   get:
 *     tags:
 *       - Grade Categories
 *     summary: Get child categories of a parent category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Child categories retrieved successfully
 *       404:
 *         description: No child categories found
 */
router.get("/children/:categoryId", protect, getChildCategories);

/**
 * @swagger
 * /api/v1/grade-categories/name/{name}:
 *   get:
 *     tags:
 *       - Grade Categories
 *     summary: Get grade category by name
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grade category retrieved successfully
 *       404:
 *         description: Grade category not found
 */
router.get("/name/:name", protect, getGradeCategoryByName);

/**
 * @swagger
 * /api/v1/grade-categories/{id}:
 *   get:
 *     tags:
 *       - Grade Categories
 *     summary: Get grade category by ID
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
 *         description: Grade category retrieved successfully
 *       404:
 *         description: Grade category not found
 */
router.get("/:id", protect, getGradeCategoryById);

/**
 * @swagger
 * /api/v1/grade-categories:
 *   post:
 *     tags:
 *       - Grade Categories
 *     summary: Create a new grade category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               value:
 *                 type: number
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *                 description: Parent category ID (for sub-categories)
 *     responses:
 *       201:
 *         description: Grade category created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", protect, restrictTo("admin"), createGradeCategory);

/**
 * @swagger
 * /api/v1/grade-categories/{id}:
 *   put:
 *     tags:
 *       - Grade Categories
 *     summary: Update grade category
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
 *               name:
 *                 type: string
 *               value:
 *                 type: number
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Grade category updated successfully
 *       404:
 *         description: Grade category not found
 */
router.put("/:id", protect, restrictTo("admin"), updateGradeCategory);

/**
 * @swagger
 * /api/v1/grade-categories/{id}:
 *   delete:
 *     tags:
 *       - Grade Categories
 *     summary: Delete grade category
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
 *         description: Grade category deleted successfully
 *       404:
 *         description: Grade category not found
 */
router.delete("/:id", protect, restrictTo("admin"), deleteGradeCategory);

export default router;
