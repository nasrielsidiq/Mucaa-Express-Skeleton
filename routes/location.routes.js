import { Router } from "express";
import {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../controllers/location.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/locations:
 *   get:
 *     tags:
 *       - Locations
 *     summary: Get all locations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all locations
 */
router.get("/", protect, getAllLocations);

/**
 * @swagger
 * /api/v1/locations/{id}:
 *   get:
 *     tags:
 *       - Locations
 *     summary: Get location by ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Location retrieved successfully
 *       404:
 *         description: Location not found
 */
router.get("/:id", protect, getLocationById);

/**
 * @swagger
 * /api/v1/locations:
 *   post:
 *     tags:
 *       - Locations
 *     summary: Create a new location
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Location created successfully
 */
router.post("/", protect, restrictTo("admin"), createLocation);

/**
 * @swagger
 * /api/v1/locations/{id}:
 *   put:
 *     tags:
 *       - Locations
 *     summary: Update location
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Location updated successfully
 */
router.put("/:id", protect, restrictTo("admin"), updateLocation);

/**
 * @swagger
 * /api/v1/locations/{id}:
 *   delete:
 *     tags:
 *       - Locations
 *     summary: Delete location
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Location deleted successfully
 */
router.delete("/:id", protect, restrictTo("admin"), deleteLocation);

export default router;
