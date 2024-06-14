import express from "express";
import {
  create,
  getAll,
  getById,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// stock routes
router.post("/create", authenticateToken, create);
router.get("/getall", authenticateToken, getAll);
router.get("/:id", authenticateToken, getById);
router.put("/update/:id", authenticateToken, updateClient);
router.delete("/delete/:id", authenticateToken, deleteClient);

export default router;
