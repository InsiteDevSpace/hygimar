import express from "express";
import {
  create,
  getAll,
  getById,
  updateOrder,
  deleteOrder,
  createOrderWithClient,
} from "../controllers/orderController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", authenticateToken, create);
router.post("/createfrom", createOrderWithClient);
router.get("/getall", authenticateToken, getAll);
router.get("/:id", authenticateToken, getById);
router.put("/update/:id", authenticateToken, updateOrder);
router.delete("/delete/:id", authenticateToken, deleteOrder);

export default router;
