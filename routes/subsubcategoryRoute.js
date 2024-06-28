import express from "express";
import {
  create,
  getAll,
  getById,
  updateSubsubcategory,
  deleteSubsubcategory,
  getSubsubcategoryDetails,
} from "../controllers/subsubcategoryController.js";

const router = express.Router();

router.post("/create", create);
router.get("/getall", getAll);
router.get("/details/:id", getSubsubcategoryDetails);
router.get("/:id", getById);
router.put("/update/:id", updateSubsubcategory);
router.delete("/delete/:id", deleteSubsubcategory);

export default router;
