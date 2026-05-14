import { Router } from "express";
import {
  listAssignments,
  createAssignment,
  replaceAssignment,
  removeAssignment,
  prioritiesReport,
  impactPreview,
} from "../controllers/assignmentController.js";

const router = Router();

/**
 * IMPORTANT: register static paths like /priorities before /:id
 * so Express does not treat "priorities" as an id.
 */
router.get("/priorities", prioritiesReport);
router.get("/impact-preview", impactPreview);
router.get("/", listAssignments);
router.post("/", createAssignment);
router.put("/:id", replaceAssignment);
router.delete("/:id", removeAssignment);

export default router;
