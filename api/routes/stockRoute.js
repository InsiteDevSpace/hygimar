import express from "express";
import { create, getAll, getById, updatestock, deletestock, } from "../controllers/stockController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// stock routes
router.post("/create",authenticateToken, create);
router.get("/getall",authenticateToken,  getAll);
router.get("/:id",authenticateToken,  getById);
router.put("/update/:id",authenticateToken,  updatestock);
router.delete("/delete/:id",authenticateToken,  deletestock);

export default router;
