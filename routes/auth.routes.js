import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { validate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validate(["name", "email", "password"]), register);
router.post("/login",    validate(["email", "password"]), login);

export default router;