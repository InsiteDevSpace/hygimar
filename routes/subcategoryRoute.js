import express from "express";
import {
  create,
  getAll,
  getById,
  updateSubcategory,
  deleteSubcategory,
  getSubCategoryDetails,
} from "../controllers/subcategoryController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Subcategory routes
router.post("/create", authenticateToken, create);
router.get("/getall", getAll);
router.get("/:id", getById);
router.put("/update/:id", authenticateToken, updateSubcategory);
router.delete("/delete/:id", authenticateToken, deleteSubcategory);
router.get("/details/:id", getSubCategoryDetails);

export default router;
