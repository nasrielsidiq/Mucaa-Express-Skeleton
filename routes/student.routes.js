import { Router } from "express";
import {
  getAllStudents,
  getStudentById,
  getStudentByUserId,
  getStudentByNip,
  getStudentsByGroupId,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";

const router = Router();

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.get("/user/:userId", getStudentByUserId);
router.get("/nip/:nip", getStudentByNip);
router.get("/group/:groupId", getStudentsByGroupId);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
