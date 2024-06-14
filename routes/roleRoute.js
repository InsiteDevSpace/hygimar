import express from "express";
import {
  create,
  getAll,
  getById,
  updaterole,
  deleterole,
} from "../controllers/roleController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Role routes
router.post("/create", create);
router.get("/getall", getAll);
router.get("/:id", getById);
router.put("/update/:id", updaterole);
router.delete("/delete/:id", deleterole);

export default router;
