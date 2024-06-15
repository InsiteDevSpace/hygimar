import Category from "../models/categoryModel.js";
import Subcategory from "../models/subcategoryModel.js";
import Product from "../models/productModel.js";

export const create = async (req, res) => {
  try {
    const { catg_name, isMark } = req.body;

    if (!catg_name) {
      return res.status(400).json({ msg: "Category name is required" });
    }

    const newCategory = new Category({
      catg_name,
      isMark,
    });

    const savedCategory = await newCategory.save();
    res.status(200).json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const catgData = await Category.find();

    if (!catgData) {
      return res.status(404).json({ msg: "Category data not found" });
    }

    res.status(200).json(catgData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCatg = async (req, res) => {
  try {
    const catgData = await Category.find({ isMark: false });

    if (!catgData) {
      return res.status(404).json({ msg: "Category data not found" });
    }

    res.status(200).json(catgData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMarkedCatg = async (req, res) => {
  try {
    const markedCatgData = await Category.find({ isMark: true });

    if (!markedCatgData) {
      return res.status(404).json({ msg: "Marked category data not found" });
    }

    res.status(200).json(markedCatgData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const catgData = await Category.findById(id);

    if (!catgData) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.status(200).json(catgData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatecatg = async (req, res) => {
  try {
    const id = req.params.id;
    const { catg_name, isMark } = req.body;

    const catg = await Category.findByIdAndUpdate(id, { catg_name, isMark });

    if (!catg) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.status(200).json({ msg: "Category updated successfully", data: catg });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletecatg = async (req, res) => {
  try {
    const deletedCatg = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCatg) {
      return res.status(404).json({ msg: "Category not found" });
    }
    res.json({ msg: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCategoriesWithSubcategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();

    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await Subcategory.find({
          id_catg: category._id,
        }).lean();
        return { ...category, subcategories };
      })
    );

    res.status(200).json(categoriesWithSubcategories);
  } catch (error) {
    console.error("Error fetching categories with subcategories:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all categories with subcategories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("subcategories");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const products = await Product.find({ id_catg: categoryId })
      .populate("id_catg")
      .populate("id_subcatg");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products by subcategory
export const getProductsBySubcategory = async (req, res) => {
  try {
    const subcategoryId = req.params.id;
    const products = await Product.find({ id_subcatg: subcategoryId })
      .populate("id_catg")
      .populate("id_subcatg");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get category details by ID with products
export const getCategoryDetails = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Fetch the category details
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    // Fetch the products for the category
    const products = await Product.find({ id_catg: categoryId })
      .populate("id_catg")
      .populate("id_subcatg");

    res.status(200).json({ category, products });
  } catch (error) {
    console.error("Error fetching category and products:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get category details by ID with products
export const getMarkedCategoryDetails = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Fetch the category details
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    // Fetch the products for the category
    const products = await Product.find({ id_catg: categoryId })
      .populate("id_catg")
      .populate("id_subcatg");

    res.status(200).json({ category, products });
  } catch (error) {
    console.error("Error fetching category and products:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Create a new category with subcategories
export const createCategoryWithSubcategories = async (req, res) => {
  try {
    const { catg_name, subcategories } = req.body;

    const newCategory = new Category({ catg_name });

    const savedCategory = await newCategory.save();

    const subcategoryDocs = subcategories.map((subcatg) => ({
      subcatg_name: subcatg,
      id_catg: savedCategory._id,
    }));

    const savedSubcategories = await Subcategory.insertMany(subcategoryDocs);

    savedCategory.subcategories = savedSubcategories.map((sub) => sub._id);
    await savedCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error creating category with subcategories:", error.message);
    res.status(500).json({ error: error.message });
  }
};
