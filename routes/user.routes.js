import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

// All routes below require authentication
router.use(protect);

router.get("/",     restrictTo("admin"), getAllUsers);
router.get("/:id",  getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", restrictTo("admin"), deleteUser);

export default router;