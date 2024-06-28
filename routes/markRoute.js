import express from "express";
import {
  create,
  getAll,
  getById,
  updateMark,
  deleteMark,
  getMarkDetails,
  createmark,
} from "../controllers/markController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Mark routes
router.post("/createmark", createmark);

router.post("/create", authenticateToken, create);
router.get("/getall", getAll);
router.get("/:id", getById);
router.put("/update/:id", authenticateToken, updateMark);
router.delete("/delete/:id", authenticateToken, deleteMark);
router.get("/details/:id", getMarkDetails);

export default router;
