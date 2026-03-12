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

const router = Router();

router.get("/", getAllGradeCategories);
router.get("/parents", getParentCategories);
router.get("/:id", getGradeCategoryById);
router.get("/name/:name", getGradeCategoryByName);
router.get("/children/:categoryId", getChildCategories);
router.post("/", createGradeCategory);
router.put("/:id", updateGradeCategory);
router.delete("/:id", deleteGradeCategory);

export default router;
