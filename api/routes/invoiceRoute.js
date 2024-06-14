import express from "express";
import {
  create,
  getAll,
  getById,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoiceController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Invoice routes
router.post("/create", authenticateToken, create);
router.get("/getall", authenticateToken, getAll);
router.get("/:id", authenticateToken, getById);
router.put("/update/:id", authenticateToken, updateInvoice);
router.delete("/delete/:id", authenticateToken, deleteInvoice);

export default router;
