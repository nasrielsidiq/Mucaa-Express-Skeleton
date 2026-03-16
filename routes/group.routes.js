import { Router } from "express";
import {
  getAllGroups,
  getGroupById,
  getGroupByName,
  getGroupsByGrade,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/group.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/groups:
 *   get:
 *     tags:
 *       - Groups
 *     summary: Get all groups
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 */
router.get("/", protect, getAllGroups);

/**
 * @swagger
 * /api/v1/groups/name/{name}:
 *   get:
 *     tags:
 *       - Groups
 *     summary: Get group by name
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
 *         description: Group retrieved successfully
 *       404:
 *         description: Group not found
 */
router.get("/name/:name", protect, getGroupByName);

/**
 * @swagger
 * /api/v1/groups/grade/{grade}:
 *   get:
 *     tags:
 *       - Groups
 *     summary: Get groups by grade level
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: grade
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Groups retrieved successfully
 *       404:
 *         description: No groups found for this grade
 */
router.get("/grade/:grade", protect, getGroupsByGrade);

/**
 * @swagger
 * /api/v1/groups/{id}:
 *   get:
 *     tags:
 *       - Groups
 *     summary: Get group by ID
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
 *         description: Group retrieved successfully
 *       404:
 *         description: Group not found
 */
router.get("/:id", protect, getGroupById);

/**
 * @swagger
 * /api/v1/groups:
 *   post:
 *     tags:
 *       - Groups
 *     summary: Create a new group
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
 *               grade:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", protect, restrictTo("admin"), createGroup);

/**
 * @swagger
 * /api/v1/groups/{id}:
 *   put:
 *     tags:
 *       - Groups
 *     summary: Update group
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
 *               grade:
 *                 type: string
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       404:
 *         description: Group not found
 */
router.put("/:id", protect, restrictTo("admin"), updateGroup);

/**
 * @swagger
 * /api/v1/groups/{id}:
 *   delete:
 *     tags:
 *       - Groups
 *     summary: Delete group
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
 *         description: Group deleted successfully
 *       404:
 *         description: Group not found
 */
router.delete("/:id", protect, restrictTo("admin"), deleteGroup);

export default router;
