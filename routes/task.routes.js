import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  getTasksByTeacherId,
  getTasksByStatus,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

const router = Router();

router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.get("/teacher/:teacherId", getTasksByTeacherId);
router.get("/status/:status", getTasksByStatus);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
