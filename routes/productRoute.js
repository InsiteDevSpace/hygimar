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
  get10products,
  search,
} from "../controllers/productController.js";
// import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Define the search route before any routes that might match an ID parameter
router.get("/search", search);

// Product routes
router.post("/create", /* authenticateToken, */ uploadFiles, create);
router.get("/getall", getAll);
router.get("/get10products", get10products);
router.get("/details/:id", getProductById);
router.get("/related/:id", getRelatedProducts);
router.get("/category/:categoryId", getProductsByCategory);
router.delete("/:productId/images", deleteProductImage);

// Define routes expecting an ID at the end
router.get("/:id", /* authenticateToken, */ getById);
router.put("/update/:id", /* authenticateToken, */ uploadFiles, updateProduct);
router.delete("/delete/:id", /* authenticateToken, */ deleteProduct);

export default router;
