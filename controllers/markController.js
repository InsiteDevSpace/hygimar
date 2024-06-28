import Mark from "../models/markModel.js";
import Product from "../models/productModel.js";

// Create a new mark

export const createmark = async (req, res) => {
  const marks = req.body;

  try {
    for (const mark of marks) {
      const existingMark = await Mark.findOne({ mark_name: mark.mark_name });
      if (!existingMark) {
        const newMark = new Mark(mark);
        await newMark.save();
      }
    }
    res.status(201).json({ message: "Marks inserted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { mark_name } = req.body;

    if (!mark_name) {
      return res.status(400).json({ msg: "Mark name is required" });
    }

    const newMark = new Mark({ mark_name });
    const savedMark = await newMark.save();

    res.status(200).json(savedMark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all marks
export const getAll = async (req, res) => {
  try {
    const marks = await Mark.find();
    if (!marks) {
      return res.status(404).json({ msg: "No marks found" });
    }
    res.status(200).json(marks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get mark by ID
export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const mark = await Mark.findById(id);
    if (!mark) {
      return res.status(404).json({ msg: "Mark not found" });
    }
    res.status(200).json(mark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a mark
export const updateMark = async (req, res) => {
  try {
    const id = req.params.id;
    const { mark_name } = req.body;

    const mark = await Mark.findByIdAndUpdate(id, { mark_name }, { new: true });
    if (!mark) {
      return res.status(404).json({ msg: "Mark not found" });
    }
    res.status(200).json({ msg: "Mark updated successfully", data: mark });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a mark
export const deleteMark = async (req, res) => {
  try {
    const deletedMark = await Mark.findByIdAndDelete(req.params.id);
    if (!deletedMark) {
      return res.status(404).json({ msg: "Mark not found" });
    }
    res.json({ msg: "Mark deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get mark details by ID with associated products
export const getMarkDetails = async (req, res) => {
  try {
    const markId = req.params.id;

    // Fetch the mark details
    const mark = await Mark.findById(markId);
    if (!mark) {
      return res.status(404).json({ msg: "Mark not found" });
    }

    // Fetch the products for the mark
    const products = await Product.find({ id_mark: markId }).populate(
      "id_mark"
    );

    res.status(200).json({ mark, products });
  } catch (error) {
    console.error("Error fetching mark and products:", error.message);
    res.status(500).json({ error: error.message });
  }
};
