import { Router } from "express";
import {
  getAllDirectors,
  getDirectorById,
  getDirectorByUserId,
  createDirector,
  updateDirector,
  deleteDirector,
} from "../controllers/director.controller.js";

const router = Router();

router.get("/", getAllDirectors);
router.get("/:id", getDirectorById);
router.get("/user/:userId", getDirectorByUserId);
router.post("/", createDirector);
router.put("/:id", updateDirector);
router.delete("/:id", deleteDirector);

export default router;
