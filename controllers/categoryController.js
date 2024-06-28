import Category from "../models/categoryModel.js";
import Subcategory from "../models/subcategoryModel.js";
import Subsubcategory from "../models/subsubcategoryModel.js"; // Ensure this line is added
import Mark from "../models/markModel.js";
import Product from "../models/productModel.js";

export const createcatg = async (req, res) => {
  const categories = req.body;

  try {
    for (const category of categories) {
      let savedCategory = await Category.findOne({
        catg_name: category.catg_name,
      });
      if (!savedCategory) {
        const newCategory = new Category({ catg_name: category.catg_name });
        savedCategory = await newCategory.save();
      }

      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          let savedSubcategory = await Subcategory.findOne({
            subcatg_name: subcategory.subcatg_name,
          });
          if (!savedSubcategory) {
            const newSubcategory = new Subcategory({
              subcatg_name: subcategory.subcatg_name,
              id_catg: savedCategory._id,
            });
            savedSubcategory = await newSubcategory.save();
          }

          if (subcategory.subsubcategories) {
            for (const subsubcategory of subcategory.subsubcategories) {
              let savedSubsubcategory = await Subsubcategory.findOne({
                subsubcatg_name: subsubcategory.subsubcatg_name,
              });
              if (!savedSubsubcategory) {
                const newSubsubcategory = new Subsubcategory({
                  subsubcatg_name: subsubcategory.subsubcatg_name,
                  id_subcatg: savedSubcategory._id,
                });
                await newSubsubcategory.save();
              }
            }
          }
        }
      }
    }

    res.status(201).json({ message: "Categories inserted successfully" });
  } catch (error) {
    console.error("Error inserting categories:", error);
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { catg_name } = req.body;

    if (!catg_name) {
      return res.status(400).json({ msg: "Category name is required" });
    }

    const newCategory = new Category({
      catg_name,
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
    const catgData = await Category.find();

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
    const markedCatgData = await Mark.find();

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
    const { catg_name } = req.body;

    const catg = await Category.findByIdAndUpdate(id, { catg_name });

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

        const subcategoriesWithSubsubcategories = await Promise.all(
          subcategories.map(async (subcategory) => {
            const subsubcategories = await Subsubcategory.find({
              id_subcatg: subcategory._id,
            }).lean();
            return { ...subcategory, subsubcategories };
          })
        );

        return {
          ...category,
          subcategories: subcategoriesWithSubsubcategories,
        };
      })
    );

    res.status(200).json(categoriesWithSubcategories);
  } catch (error) {
    console.error("Error fetching categories with subcategories:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate({
      path: "subcategories",
      populate: { path: "subsubcategories" },
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const products = await Product.find({ id_catg: categoryId })
      .populate("id_catg")
      .populate("id_subcatg")
      .populate("id_subsubcatg")
      .sort({ createdAt: -1 }); // Sort by creation date in descending order

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsBySubcategory = async (req, res) => {
  try {
    const subcategoryId = req.params.id;
    const products = await Product.find({ id_subcatg: subcategoryId })
      .populate("id_catg")
      .populate("id_subcatg")
      .populate("id_subsubcatg")
      .sort({ createdAt: -1 }); // Sort by creation date in descending order

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryDetails = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    const products = await Product.find({ id_catg: categoryId })
      .populate("id_catg")
      .populate("id_subcatg")
      .populate("id_subsubcatg")
      .sort({ createdAt: -1 }); // Sort by creation date in descending order

    res.status(200).json({ category, products });
  } catch (error) {
    console.error("Error fetching category and products:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getMarkedCategoryDetails = async (req, res) => {
  try {
    const markId = req.params.id;

    const mark = await Mark.findById(markId);
    if (!mark) {
      return res.status(404).json({ msg: "Mark not found" });
    }

    const products = await Product.find({ id_mark: markId })
      .populate("id_catg")
      .populate("id_subcatg")
      .populate("id_subsubcatg")
      .sort({ createdAt: -1 }); // Sort by creation date in descending order

    res.status(200).json({ mark, products });
  } catch (error) {
    console.error("Error fetching mark and products:", error.message);
    res.status(500).json({ error: error.message });
  }
};

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
