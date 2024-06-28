import Product from "../models/productModel.js";
import Subsubcategory from "../models/subsubcategoryModel.js";
import Subcategory from "../models/subcategoryModel.js";

export const create = async (req, res) => {
  try {
    const { id_subcatg, subsubcatg_name } = req.body;

    if (!subsubcatg_name || !id_subcatg) {
      return res
        .status(400)
        .json({ msg: "Sub-subcategory name and subcategory ID are required" });
    }

    const newSubsubcategory = new Subsubcategory({
      id_subcatg,
      subsubcatg_name,
    });

    const savedSubsubcategory = await newSubsubcategory.save();

    // Also add this subsubcategory reference to the corresponding subcategory
    await Subcategory.findByIdAndUpdate(
      id_subcatg,
      { $push: { subsubcategories: savedSubsubcategory._id } },
      { new: true }
    );

    res.status(200).json(savedSubsubcategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const subsubcategories = await Subsubcategory.find().populate("id_subcatg");

    if (!subsubcategories) {
      return res.status(404).json({ msg: "Sub-subcategory data not found" });
    }

    res.status(200).json(subsubcategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const subsubcategory = await Subsubcategory.findById(id).populate(
      "id_subcatg"
    );

    if (!subsubcategory) {
      return res.status(404).json({ msg: "Sub-subcategory not found" });
    }

    res.status(200).json(subsubcategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSubsubcategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { id_subcatg, subsubcatg_name } = req.body;

    const subsubcategory = await Subsubcategory.findByIdAndUpdate(
      id,
      { id_subcatg, subsubcatg_name },
      { new: true }
    );

    if (!subsubcategory) {
      return res.status(404).json({ msg: "Sub-subcategory not found" });
    }

    res.status(200).json({
      msg: "Sub-subcategory updated successfully",
      data: subsubcategory,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSubsubcategory = async (req, res) => {
  try {
    const deletedSubsubcategory = await Subsubcategory.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSubsubcategory) {
      return res.status(404).json({ msg: "Sub-subcategory not found" });
    }

    // Also remove this subsubcategory reference from the corresponding subcategory
    await Subcategory.findByIdAndUpdate(
      deletedSubsubcategory.id_subcatg,
      { $pull: { subsubcategories: deletedSubsubcategory._id } },
      { new: true }
    );

    res.json({ msg: "Sub-subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubsubcategoryDetails = async (req, res) => {
  try {
    const subsubcategoryId = req.params.id;

    // Fetch the sub-subcategory details
    const subsubcategory = await Subsubcategory.findById(
      subsubcategoryId
    ).populate("id_subcatg");
    if (!subsubcategory) {
      return res.status(404).json({ msg: "Sub-subcategory not found" });
    }

    // Fetch the products for the sub-subcategory
    const products = await Product.find({ id_subsubcatg: subsubcategoryId })
      .populate("id_catg")
      .populate("id_subcatg")
      .populate("id_subsubcatg");

    res.status(200).json({ subsubcategory, products });
  } catch (error) {
    console.error(
      "Error fetching sub-subcategory and products:",
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};
