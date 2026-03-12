import { Router } from "express";
import {
  getAllGivedTasks,
  getGivedTaskById,
  getGivedTasksByTaskId,
  getGivedTasksByStudentId,
  getGivedTasksByStatus,
  createGivedTask,
  updateGivedTask,
  deleteGivedTask,
} from "../controllers/gived_task.controller.js";

const router = Router();

router.get("/", getAllGivedTasks);
router.get("/:id", getGivedTaskById);
router.get("/task/:taskId", getGivedTasksByTaskId);
router.get("/student/:studentId", getGivedTasksByStudentId);
router.get("/status/:status", getGivedTasksByStatus);
router.post("/", createGivedTask);
router.put("/:id", updateGivedTask);
router.delete("/:id", deleteGivedTask);

export default router;
