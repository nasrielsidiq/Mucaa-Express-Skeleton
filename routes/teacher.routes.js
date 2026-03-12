import { Router } from "express";
import {
  getAllTeachers,
  getTeacherById,
  getTeacherByUserId,
  getTeacherByNrp,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller.js";

const router = Router();

router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);
router.get("/user/:userId", getTeacherByUserId);
router.get("/nrp/:nrp", getTeacherByNrp);
router.post("/", createTeacher);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);

export default router;
