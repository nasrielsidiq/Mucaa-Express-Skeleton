import { Router } from "express";
import {
  getAllGrades,
  getGradeById,
  getGradesByStudentId,
  getGradesByTeacherId,
  getGradesByTaskId,
  createGrade,
  updateGrade,
  deleteGrade,
} from "../controllers/grade.controller.js";

const router = Router();

router.get("/", getAllGrades);
router.get("/:id", getGradeById);
router.get("/student/:studentId", getGradesByStudentId);
router.get("/teacher/:teacherId", getGradesByTeacherId);
router.get("/task/:taskId", getGradesByTaskId);
router.post("/", createGrade);
router.put("/:id", updateGrade);
router.delete("/:id", deleteGrade);

export default router;
