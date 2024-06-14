import express from "express";
import {
  create,
  getAll,
  getById,
  updatecatg,
  deletecatg,
  getCatg,
  getMarkedCatg,
  getAllCategoriesWithSubcategories,
  getCategories,
  getProductsByCategory,
  getProductsBySubcategory,
  getCategoryDetails,
  getMarkedCategoryDetails,
} from "../controllers/categoryController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Category routes
router.post("/create", authenticateToken, create);
router.get("/getall", authenticateToken, getAll);
//router.get("/getcatg", getCatg); // Ensure this is correct
router.get("/getcatg", getAllCategoriesWithSubcategories); // Ensure this is correct

router.get("/getmarkedcatg", getMarkedCatg); // New route
router.get("/:id", authenticateToken, getById);
router.put("/update/:id", authenticateToken, updatecatg);
router.delete("/delete/:id", authenticateToken, deletecatg);
//router.get("/getcatgsubcatg", getAllCategoriesWithSubcategories);

router.get("/getcatg", getCategories);
router.get("/products/:id", getProductsByCategory);
router.get("/subproducts/:id", getProductsBySubcategory);
router.get("/details/:id", getCategoryDetails);
router.get("/detailsmarked/:id", getMarkedCategoryDetails);

export default router;
