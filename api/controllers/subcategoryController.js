import Product from "../models/productModel.js";
import Subcategory from "../models/subcategoryModel.js";

export const create = async (req, res) => {
  try {
    const { id_catg, subcatg_name } = req.body;

    if (!subcatg_name || !id_catg) {
      return res
        .status(400)
        .json({ msg: "Subcategory name and category ID are required" });
    }

    const newSubcategory = new Subcategory({
      id_catg,
      subcatg_name,
    });

    const savedSubcategory = await newSubcategory.save();
    res.status(200).json(savedSubcategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate("id_catg");

    if (!subcategories) {
      return res.status(404).json({ msg: "Subcategory data not found" });
    }

    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const subcategory = await Subcategory.findById(id).populate("id_catg");

    if (!subcategory) {
      return res.status(404).json({ msg: "Subcategory not found" });
    }

    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSubcategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { id_catg, subcatg_name } = req.body;

    const subcategory = await Subcategory.findByIdAndUpdate(
      id,
      { id_catg, subcatg_name },
      { new: true }
    );

    if (!subcategory) {
      return res.status(404).json({ msg: "Subcategory not found" });
    }

    res
      .status(200)
      .json({ msg: "Subcategory updated successfully", data: subcategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSubcategory = async (req, res) => {
  try {
    const deletedSubcategory = await Subcategory.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSubcategory) {
      return res.status(404).json({ msg: "Subcategory not found" });
    }
    res.json({ msg: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get category details by ID with products
export const getSubCategoryDetails = async (req, res) => {
  try {
    const subcategoryId = req.params.id;

    // Fetch the category details
    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ msg: "Category not found" });
    }

    // Fetch the products for the category
    const products = await Product.find({ id_subcatg: subcategoryId });

    res.status(200).json({ subcategory, products });
  } catch (error) {
    console.error("Error fetching subcategory and products:", error.message);
    res.status(500).json({ error: error.message });
  }
};
