import express from "express";
import {
  create,
  getAll,
  getById,
  updateProduct,
  deleteProduct,
  uploadFiles,
  getProductById,
  getRelatedProducts,
  getProductsByCategory,
  deleteProductImage,
} from "../controllers/productController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Product routes
router.post("/create", authenticateToken, uploadFiles, create);
router.get("/getall", getAll);
router.get("/:id", authenticateToken, getById);
router.put("/update/:id", uploadFiles, authenticateToken, updateProduct);
router.get("/details/:id", getProductById);
router.get("/related/:id", getRelatedProducts);

router.delete("/delete/:id", authenticateToken, deleteProduct);
router.get("/category/:categoryId", getProductsByCategory);
router.delete("/:productId/images", deleteProductImage);

export default router;
