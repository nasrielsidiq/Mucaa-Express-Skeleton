import { Router } from "express";
import {
  getAllGroups,
  getGroupById,
  getGroupByName,
  getGroupsByGrade,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/group.controller.js";

const router = Router();

router.get("/", getAllGroups);
router.get("/:id", getGroupById);
router.get("/name/:name", getGroupByName);
router.get("/grade/:grade", getGroupsByGrade);
router.post("/", createGroup);
router.put("/:id", updateGroup);
router.delete("/:id", deleteGroup);

export default router;
