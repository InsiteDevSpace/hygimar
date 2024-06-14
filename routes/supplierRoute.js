import express from "express";
import { create, getAll, getById, updatesupplier, deletesupplier, } from "../controllers/supplierController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// User routes
router.post("/create",authenticateToken, create);
router.get("/getall", authenticateToken, getAll);
router.get("/:id",  authenticateToken, getById);
router.put("/update/:id", authenticateToken, updatesupplier);
router.delete("/delete/:id", authenticateToken, deletesupplier);

export default router;
