import express from "express";
import {
  create,
  getAll,
  getById,
  updateLivreur,
  deleteLivreur,
} from "../controllers/livreurController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Livreur routes
router.post("/create", authenticateToken, create);
router.get("/getall", authenticateToken, getAll);
router.get("/:id", authenticateToken, getById);
router.put("/update/:id", authenticateToken, updateLivreur);
router.delete("/delete/:id", authenticateToken, deleteLivreur);

export default router;
