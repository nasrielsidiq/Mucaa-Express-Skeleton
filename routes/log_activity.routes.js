import { Router } from "express";
import {
  getAllActivities,
  getActivityById,
  getActivitiesByUserId,
  getRecentActivities,
  getActivitiesByDateRange,
  createActivity,
  deleteOldActivities,
  deleteActivitiesByUserId,
} from "../controllers/log_activity.controller.js";

const router = Router();

router.get("/", getAllActivities);
router.get("/recent", getRecentActivities);
router.get("/:id", getActivityById);
router.get("/user/:userId", getActivitiesByUserId);
router.post("/", createActivity);
router.post("/date-range", getActivitiesByDateRange);
router.delete("/old", deleteOldActivities);
router.delete("/user/:userId", deleteActivitiesByUserId);

export default router;
