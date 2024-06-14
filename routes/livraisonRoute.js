import express from "express";
import { create, getAll, getById, updatelivraison, deletelivraison, } from "../controllers/livraisonController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// livraison routes
router.post("/create",authenticateToken, create);
router.get("/getall",authenticateToken,  getAll);
router.get("/:id",authenticateToken,  getById);
router.put("/update/:id",authenticateToken,  updatelivraison);
router.delete("/delete/:id",authenticateToken,  deletelivraison);

export default router;
